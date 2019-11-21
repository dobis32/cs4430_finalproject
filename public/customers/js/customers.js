var inflateEmployeeRecord = function(recordData){
    console.log(recordData);
    const recordDiv = document.createElement('tr');
    // ID
    const id = document.createElement('td');
    id.classList.add('id')
    id.innerHTML = recordData.CustomerID;
    recordDiv.appendChild(id);
    // First name
    const fname = document.createElement('td');
    fname.innerHTML = recordData.FirstName;
    recordDiv.appendChild(fname);
    // Last name
    const lname = document.createElement('td');
    lname.innerHTML = recordData.LastName;
    recordDiv.appendChild(lname);
    // Phone
    const phone = document.createElement('td');
    phone.innerHTML = recordData.Phone;
    recordDiv.appendChild(phone);
    // Edit
    const editTD = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.addEventListener('click', event => {
        location.href = `/customers/edit?id=${recordData.CustomerID}`
    });
    editButton.innerHTML = 'Edit';
    editButton.classList.add('editButton');
    editTD.appendChild(editButton);
    recordDiv.appendChild(editTD);
    // Remove
    const removeTD = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.addEventListener('click', async (event) => {
        let confirmed = confirm('Are you sure you want to delete this record?');
        if (confirmed) {
            let result = await postData(`/sales/edit`, { query: `UPDATE sales SET CustomerID = NULL WHERE CustomerID = ${recordData.CustomerID}` });
            if (result.status) result = await postData(`/customers/remove`, { id: recordData.CustomerID });
            if (result.status) {
                alert('Record removed successfully!');
                location.href = '/customers';
            } else {
                alert('Record removal failed!');
            }
            
        }
    });
    removeButton.innerHTML = 'Remove';
    removeButton.classList.add('removeButton');
    removeTD.appendChild(removeButton);
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
