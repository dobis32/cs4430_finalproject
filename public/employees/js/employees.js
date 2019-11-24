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

var inflateEmployeeRecord = function(recordData){
    const recordDiv = document.createElement('tr');
    const id = document.createElement('td');
    id.classList.add('id')
    id.innerHTML = recordData.EmployeeID;
    recordDiv.appendChild(id);
    const fname = document.createElement('td');
    fname.innerHTML = recordData.FirstName;
    recordDiv.appendChild(fname);
    const lname = document.createElement('td');
    lname.innerHTML = recordData.LastName;
    recordDiv.appendChild(lname);
    const hireDate = document.createElement('td');
    hireDate.innerHTML = recordData.HireDate.split('T')[0];
    recordDiv.appendChild(hireDate);
    const salesToDate = document.createElement('td');
    salesToDate.innerHTML = recordData.allSales.toFixed(2);
    recordDiv.appendChild(salesToDate);
    const phone = document.createElement('td');
    phone.innerHTML = recordData.Phone;
    recordDiv.appendChild(phone);
    const commission = document.createElement('td');
    commission.innerHTML = recordData.Commission;
    recordDiv.appendChild(commission);
    const editTD = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.addEventListener('click', event => {
        location.href = `/employees/edit?id=${recordData.EmployeeID}`
    });
    editButton.innerHTML = 'Edit';
    editButton.classList.add('editButton')
    editTD.appendChild(editButton)
    recordDiv.appendChild(editTD);
    const removeTD = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', async event => {
        let confirmed = confirm('Are you sure you want to delete this record?');
        if (confirmed) {
            let result = await postData(`/employees/remove`, { id: recordData.EmployeeID });
            if (result.status) {
                alert('Record removed successfully!');
                location.href = '/employees';
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
const recordsData = JSON.parse(document.querySelector('#hidden-buffer').value);
const recordsList = document.querySelector('#records-list')
console.log(recordsData)
for(let i = 0; i < recordsData.length; i++){
    recordsList.appendChild(inflateEmployeeRecord(recordsData[i]))

}
