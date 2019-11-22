var inflateEmployeeRecord = function(recordData){
    console.log(recordData);
    const recordDiv = document.createElement('tr');
    // ID
    const id = document.createElement('td');
    id.classList.add('id')
    id.innerHTML = recordData.EmployeeID;
    recordDiv.appendChild(id);
    // First name
    const fname = document.createElement('td');
    fname.innerHTML = recordData.FirstName;
    recordDiv.appendChild(fname);
    // Last name
    const lname = document.createElement('td');
    lname.innerHTML = recordData.LastName;
    recordDiv.appendChild(lname);
    // HireDate
    const hireDate = document.createElement('td');
    hireDate.innerHTML = recordData.HireDate.split('T')[0];
    recordDiv.appendChild(hireDate);
    // Sales to date
    const salesToDate = document.createElement('td');
    salesToDate.innerHTML = recordData.SalesToDate.toFixed(2);
    recordDiv.appendChild(salesToDate);
    // Phone
    const phone = document.createElement('td');
    phone.innerHTML = recordData.Phone;
    recordDiv.appendChild(phone);
    // Commission
    const commission = document.createElement('td');
    commission.innerHTML = recordData.Commission;
    recordDiv.appendChild(commission);
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
