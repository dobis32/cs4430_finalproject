var inflateEmployeeRecord = function(recordData){
    console.log(recordData);
    const recordDiv = document.createElement('tr');
    // ID
    const id = document.createElement('td');
    id.classList.add('id')
    id.innerHTML = recordData.SaleID ? recordData.SaleID : 'NULL' ;
    recordDiv.appendChild(id);
    // Employee ID
    const eid = document.createElement('td');
    id.classList.add('id')
    eid.innerHTML = recordData.EmployeeID ? recordData.EmployeeID : 'NULL';
    recordDiv.appendChild(eid);
    // Customer ID
    const cid = document.createElement('td');
    id.classList.add('id')
    cid.innerHTML = recordData.CustomerID ? recordData.CustomerID : 'NULL';
    recordDiv.appendChild(cid);
    // Vehicle ID
    const vid = document.createElement('td');
    id.classList.add('id')
    vid.innerHTML = recordData.VehicleID ? recordData.VehicleID : 'NULL';
    recordDiv.appendChild(vid);
    // Subtotal
    const salesToDate = document.createElement('td');
    salesToDate.innerHTML = recordData.SubTotal.toFixed(2);
    recordDiv.appendChild(salesToDate);
    // Commission
    const commission = document.createElement('td');
    const commissionAmount = (recordData.Commission * recordData.SubTotal).toFixed(2)
    commission.innerHTML = commissionAmount;
    recordDiv.appendChild(commission);
    // Net total
    const netTotal = document.createElement('td');
    netTotal.innerHTML = recordData.SubTotal.toFixed(2) - commissionAmount;
    recordDiv.appendChild(netTotal);
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
