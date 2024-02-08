// Function to generate a unique ID for form data
// display();
let fdata = [];
let basket = [];
        const locallist = JSON.parse(localStorage.getItem('crud'));
        let existingData = (document.cookie.split('=')[1] || '');
        let cookieData = existingData ? JSON.parse(existingData) : [];
        fdata = locallist.concat(cookieData);
display();

function formDisplay(){
    tbl1.style.display = 'none';
    tbl2.style.display = 'none';
    travelForm.style.display = "block";
    totalTrips.style.display = 'none';
    totalDuration.style.display = 'none';
    ttl.style.display = 'none';
    dur1.style.display = 'none';
}

function tblDisplay(){
travelForm.style.display = 'none';
tbl1.style.display = 'block';
tbl2.style.display = 'block';
totalTrips.style.display = 'block';
totalDuration.style.display = 'block';
display();
}
let id1= null;

function generateID() {
    let id = 1; // Initialize ID as 0

    // Check local storage data
    if (localStorage.getItem('crud') !== null) {
        const maxIDLocalStorage = Math.max(...locallist.map(data => data.id));
        id = Math.max(id, maxIDLocalStorage + 1);
    }
    // Check cookie data
    if (document.cookie.includes('x=')) {
        const maxIDCookie = Math.max(...cookieData.map(data => data.id));
        id = Math.max(id, maxIDCookie + 1);
    }
    return id;
}

document.getElementById('travelForm').addEventListener('submit', function(event) {
    display();
    event.preventDefault(); // Prevent the form from submitting normally
    let arr = getcrudData();
    if (arr === null) {
        arr = []; 
    }
    //Retrieve form values
    let fromDestination = document.getElementById('fromDestination').value;
    let toDestination = document.getElementById('toDestination').value;
    let duration= document.getElementById('duration').value;
    let destinationTypes = [];
    if (document.getElementById('beach').checked) {
        destinationTypes.push(document.getElementById('beach').value);
    }
    if (document.getElementById('mtn').checked) {
        destinationTypes.push(document.getElementById('mtn').value);
    }
    if (document.getElementById('city').checked) {
        destinationTypes.push(document.getElementById('city').value);
    }
    if (document.getElementById('countryside').checked) {
        destinationTypes.push(document.getElementById('countryside').value);
    }
    var other = document.getElementById('other').value;
    if (other) {
        destinationTypes.push(other);
    }
    let travelMode = document.querySelector('input[name="travelMode"]:checked').value;
    let destination = document.getElementById('destination').value;
    let hotel = document.getElementById('hotel').value;
    // addFormData();
    
    const obj = {
        id: generateID(),
        frdest: fromDestination,
        tdest: toDestination,
        dur: duration,
        dtype: destinationTypes,
        mode: travelMode,
        dest: destination,
        hotel: hotel,
    };

    // Adding Data into local str
    if (travelMode === 'Road') {
        arr.push(obj);
        setcrudData(arr);
        console.log('arrrr', arr);
    }

    // Adding Data into cookie  
    else if (travelMode === 'Flight') {
        let existingData = (document.cookie.split('=')[1] || '');
        basket = existingData ? JSON.parse(existingData) : [];
        console.log('baskett',basket)
        basket.push(obj);
        document.cookie = 'x=' + JSON.stringify(basket);
    }
  
    location.reload();
    display();
    }
    );

function getcrudData() {
    let arr = JSON.parse(localStorage.getItem('crud'));
    return arr;
}

function setcrudData(arr) {
    localStorage.setItem('crud', JSON.stringify(arr));
    return arr;
}

function display() {
    let ttlTrip = document.getElementById("totalTrips");
    let ttlDuration = document.getElementById("totalDuration")
    ttlDuration=0;
    let html = '';
    fdata.forEach((data, index) => {
        html += `<tr>
            <td>${data.id}</td>
            <td>${data.frdest}</td>
            <td>${data.tdest}</td>
            <td>${data.dur}</td>
            <td>${data.dtype.join(', ')}</td>
            <td>${data.mode}</td>
            <td>${data.dest}</td>
            <td>${data.hotel}</td>
            <td>
                <button><a href="javascript:void(0)" onclick="updateData(${data.id},${index})">Update</a></button>
                <button><a href="javascript:void(0)" onclick="deleteData(${data.id})">Delete</a></button>
            </td>
        </tr>`;
        ttlDuration = ttlDuration + parseInt(`${data.dur}`);
    });
    document.getElementById('tbl2').innerHTML = html;
    ttlTrip.innerText = fdata.length;
    document.getElementById("totalDuration").innerText = ttlDuration;
}

function deleteData(id, mode) {
    let con = confirm(`Are you sure you want to delete object with ID ${id}?`);
    if (con === true) {
        fdata = fdata.filter(item => item.id !== id);
        updatedlocallist= fdata.filter((e)=>{
            if(e.mode == "Road")
               {
                  return e;
               }})
                setcrudData(updatedlocallist);
                updatedcookieList = fdata.filter((e)=>{
                if(e.mode == "Flight")
                {
                    return e;
                }
        })
        document.cookie = 'x=' + JSON.stringify(updatedcookieList);    }
    // display();
    location.reload();
    display();
}

function updateData(rid,index)
{
    let con = confirm(`are you Sure Want to Update ${rid} id object?`)
    if(con === true)
    {
        formDisplay();
        let frmDest = document.getElementById('fromDestination')
            frmDest.value = fdata[index].frdest;
        let toDest = document.getElementById('toDestination')
            toDest.value = fdata[index].tdest;
        let Dur = document.getElementById('duration')
            Dur.value = fdata[index].dur;
        let mode;
        let mode1;
                mode1 = document.getElementsByName("travelMode").forEach(input =>{
                        if(fdata[index].mode == "Road"){
                        mode = document.getElementById("road");
                        mode.checked = true;  
                        // console.log('rrr',mode);
                        }
                        else{
                            mode = document.getElementById("flight");
                            mode.checked = true;
                            console.log('fff',mode);
                        }
            // console.log('mde',mode.value);
        });

        let beach = document.getElementById('beach');
        let mtn = document.getElementById('mtn');
        let city = document.getElementById('city');
        let countryside = document.getElementById('countryside');
        let fdestination = document.getElementById('destination')
        fdestination.value = fdata[index].dest;
        let uhotel = document.getElementById('hotel')
        uhotel.value = fdata[index].hotel;
           if (fdata[index].dtype.includes('Beach')) {
                beach.checked = true;
            }
            if(fdata[index].dtype.includes('Mountain')){
                mtn.checked = true;
            }
            if(fdata[index].dtype.includes('City')){
                city.checked = true;
            }
            if(fdata[index].dtype.includes('Countryside'))
            {
                countryside.checked = true;
            }
        // });
        let tmode = mode.value;
        document.getElementById('updatebtn').onclick = function(e) {
            e.preventDefault(); // Prevent the default form submission behavior

            // addFormData();
            let fromDestination = document.getElementById('fromDestination').value;
            let toDestination = document.getElementById('toDestination').value;
            let duration= document.getElementById('duration').value;
            let destinationTypes = [];
            if (document.getElementById('beach').checked) {
                destinationTypes.push(document.getElementById('beach').value);
            }
            if (document.getElementById('mtn').checked) {
                destinationTypes.push(document.getElementById('mtn').value);
            }
            if (document.getElementById('city').checked) {
                destinationTypes.push(document.getElementById('city').value);
            }
            if (document.getElementById('countryside').checked) {
                destinationTypes.push(document.getElementById('countryside').value);
            }
            var other = document.getElementById('other').value;
            if (other) {
                destinationTypes.push(other);
            }
            let travelMode = document.querySelector('input[name="travelMode"]:checked').value;
            let destination = document.getElementById('destination').value;
            let hotel = document.getElementById('hotel').value;
            
            const obj = {
                id: rid,
                frdest: fromDestination,
                tdest: toDestination,
                dur: duration,
                dtype: destinationTypes,
                mode: travelMode,
                dest: destination,
                hotel: hotel,
            };

            //updating the specified index Data
            fdata[index] = obj;
            updatedlocallist= fdata.filter((e)=>{
                if(e.mode == "Road")
                   {
                      return e;
                   }})
                    setcrudData(updatedlocallist);
                    updatedcookieList = fdata.filter((e)=>{
                    if(e.mode == "Flight")
                    {
                        return e;
                    }
            })
            document.cookie = 'x=' + JSON.stringify(updatedcookieList); 
            location.reload();
            display();
        };
}
}

function displaysort() {
    let ttlTrip = document.getElementById("totalTrips");
    let ttlDuration = document.getElementById("totalDuration");
    ttlDuration=0;
    let html = '';

    // Sort fdata by the id field
    fdata.sort((a, b) => a.id - b.id);

    fdata.forEach((data, index) => {
        html += `<tr>
            <td>${data.id}</td>
            <td>${data.frdest}</td>
            <td>${data.tdest}</td>
            <td>${data.dur}</td>
            <td>${data.dtype.join(', ')}</td>
            <td>${data.mode}</td>
            <td>${data.dest}</td>
            <td>${data.hotel}</td>
            <td>
                <button><a href="javascript:void(0)" onclick="updateData(${data.id},${index})">Update</a></button>
                <button><a href="javascript:void(0)" onclick="deleteData(${data.id})">Delete</a></button>
            </td>
        </tr>`;
        ttlDuration += parseInt(data.dur);
    });

    document.getElementById('tbl2').innerHTML = html;
    ttlTrip.innerText = fdata.length;
    document.getElementById("totalDuration").innerText = ttlDuration;
}
