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
    price.innerHTML = recordData.Price;
    recordDiv.appendChild(price);
    // Edit
    const editTD = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('editButton')
    editTD.appendChild(editButton)
    recordDiv.appendChild(editTD);
    // Remove
    const removeTD = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'Remove';
    removeButton.classList.add('removeButton')
    removeTD.appendChild(removeButton)
    recordDiv.appendChild(removeTD);

    return recordDiv;
}
const recordsData = JSON.parse(document.querySelector('#hidden-buffer').value);
const recordsList = document.querySelector('#records-list')
for(let i = 0; i < recordsData.length; i++){
    recordsList.appendChild(inflateEmployeeRecord(recordsData[i]))

}
