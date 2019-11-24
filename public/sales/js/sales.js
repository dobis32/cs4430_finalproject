async function postData(url, data) {
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

var inflateEmployeeRecord = function(recordData){
    const recordDiv = document.createElement('tr');
    const id = document.createElement('td');
    const idLink = document.createElement('a');
    id.appendChild(idLink);
    idLink.href = recordData.SaleID ? `/sales/edit?id=${ recordData.SaleID }` : '';
    id.classList.add('id')
    idLink.innerHTML = recordData.SaleID ? recordData.SaleID : 'NULL' ;
    recordDiv.appendChild(id);
    const eid = document.createElement('td');
    const eidLink = document.createElement('a');
    eid.appendChild(eidLink);
    eidLink.href = recordData.SaleID ? `/employees/edit?id=${ recordData.EmployeeID }` : '';
    eid.classList.add('id')
    eidLink.innerHTML = recordData.EmployeeID ? recordData.EmployeeID : 'NULL';
    recordDiv.appendChild(eid);
    const cid = document.createElement('td');
    const cidLink = document.createElement('a');
    cid.appendChild(cidLink);
    cidLink.href = recordData.CustomerID ? `/customers/edit?id=${ recordData.CustomerID }` : '';
    cid.classList.add('id')
    cidLink.innerHTML = recordData.CustomerID ? recordData.CustomerID : 'NULL';
    recordDiv.appendChild(cid);
    const vid = document.createElement('td');
    const vidLink = document.createElement('a');
    vid.appendChild(vidLink);
    vidLink.href = recordData.VehicleID ? `/vehicles/edit?id=${ recordData.VehicleID }` : '';
    vid.classList.add('id')
    vidLink.innerHTML = recordData.VehicleID ? recordData.VehicleID : 'NULL';
    recordDiv.appendChild(vid);
    const salesToDate = document.createElement('td');
    salesToDate.innerHTML = recordData.SubTotal.toFixed(2);
    recordDiv.appendChild(salesToDate);
    const commission = document.createElement('td');
    const commissionAmount = (recordData.Commission * recordData.SubTotal).toFixed(2)
    commission.innerHTML = commissionAmount;
    recordDiv.appendChild(commission);
    const netTotal = document.createElement('td');
    netTotal.innerHTML = (recordData.SubTotal - commissionAmount).toFixed(2);
    recordDiv.appendChild(netTotal);
    const editTD = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('editButton')
    editButton.addEventListener('click', event => {
        location.href = `/sales/edit?id=${recordData.SaleID}`
    });
    editTD.appendChild(editButton);
    recordDiv.appendChild(editTD);
    const removeTD = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', async event => {
        const result = await postData('/sales/remove', { id: recordData.SaleID });
        if(result.status){
          alert(result.message);
          location.reload();
        }
    });
    removeButton.innerHTML = 'Remove';
    removeButton.classList.add('removeButton');
    removeTD.appendChild(removeButton);
    recordDiv.appendChild(removeTD);
    return recordDiv;
}
const recordsData = JSON.parse(document.querySelector('#hidden-buffer').value);
const recordsList = document.querySelector('#records-list')
for(let i = 0; i < recordsData.length; i++){
    recordsList.appendChild(inflateEmployeeRecord(recordsData[i]))

}
