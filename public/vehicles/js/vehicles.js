var inflateEmployeeRecord = function(recordData){
    console.log(recordData);
    const recordDiv = document.createElement('tr');
    // ID
    const id = document.createElement('td');
    id.classList.add('id')
    id.innerHTML = recordData.VehicleID;
    recordDiv.appendChild(id);
    // Make
    const make = document.createElement('td');
    make.innerHTML = recordData.Make;
    recordDiv.appendChild(make);
    // Model
    const model = document.createElement('td');
    model.innerHTML = recordData.Model;
    recordDiv.appendChild(model);
    // Year
    const year = document.createElement('td');
    year.innerHTML = recordData.Year;
    recordDiv.appendChild(year);
    // Color
    const color = document.createElement('td');
    color.innerHTML = recordData.Color;
    recordDiv.appendChild(color);
    // Price
    const price = document.createElement('td');
    const buffer = parseFloat(recordData.Price).toFixed(2);
    price.innerHTML = buffer;
    recordDiv.appendChild(price);
    // Edit
    const editTD = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.addEventListener('click', event => {
        location.href = `/vehicles/edit?id=${recordData.VehicleID}`
    });
    editButton.innerHTML = 'Edit';
    editButton.classList.add('editButton')
    editTD.appendChild(editButton)
    recordDiv.appendChild(editTD);
    // Remove
    const removeTD = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', async event => {
        let confirmed = confirm('Are you sure you want to delete this record?');
        if (confirmed) {
            let result = await postData(`/vehicles/remove`, { id: recordData.VehicleID });
            console.log(result)
            if (result.status) {
                alert('Record removed successfully!');
                location.href = '/vehicles';
            } else {
                alert('Record removal failed!');
            }
            
        }
    });
    removeButton.innerHTML = 'Remove';
    removeButton.classList.add('removeButton')
    removeTD.appendChild(removeButton)
    recordDiv.appendChild(removeTD);

    return recordDiv;
}

const postData = async function(url, data) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', 
      referrer: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return await response.json();
}

const recordsData = JSON.parse(document.querySelector('#hidden-buffer').value);
const recordsList = document.querySelector('#records-list')
for(let i = 0; i < recordsData.length; i++){
    recordsList.appendChild(inflateEmployeeRecord(recordsData[i]))

}
