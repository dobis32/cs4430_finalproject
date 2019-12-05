const validData = function(employeeID, customerID, vehicleID, subtotal, commission) {
    let isValid = true;
    if (isNaN(employeeID) || isNaN(customerID) || isNaN(vehicleID) || isNaN(subtotal) || isNaN(commission)) isValid = false;
    else if (employeeID < 1 || customerID < 1 || vehicleID < 1 || subtotal <= 0 || commission <= 0){
        isValid = false;
    }
    return isValid;
}

async function getData(url) {
    const response = await fetch(url, {
      method: 'GET', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      redirect: 'follow', 
      referrer: 'no-referrer', 
    });
    return await response.json();
  }

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

const checkEmployeeID = async function() {
    let isValid = true;
    try {
        const id = parseInt(document.querySelector('#employee-id').value);
        if (isNaN(id)) isValid = false;
        else if (id > 0) {
            const result = await getData(`/employees?id=${id}`)
            if (result.status) {
                const data = JSON.parse(result.data)[0];
                document.querySelector("#commission").innerHTML = parseFloat(data.Commission).toFixed(2);
            } else {
                isValid = false;
            }
        } else {
            isValid = false;
        }
    } catch(error) {
        console.log(error)
        isValid = false;
    }
    if (isValid){
        document.querySelector('#customer-id').disabled = false;
        document.querySelector('#cid-check').disabled = false;
    } else {
        alert('No employee record with that ID could be found!')
    }
}

const checkCustomerID = async function() {
    let isValid = true;
    try {
        const id = parseInt(document.querySelector('#customer-id').value);
        if (isNaN(id)) isValid = false;
        else if (id > 0) {
            const result = await getData(`/customers?id=${id}`)
            if (!result.status) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
    } catch(error) {
        isValid = false;
    }
    if (isValid){
        try {
            let id = document.querySelector('#id-buffer').value;
            let buffer = id.split('-');
            if (buffer.length > 1) {
                id = parseInt(buffer[1]) * -1;
            }
            if (id < 0) {
                document.querySelector('#vehicle-id').disabled = false;
                document.querySelector('#vid-check').disabled = false;
            } else {
                document.querySelector('#save-changes').disabled = false;
            }
        } catch (error) {
            console.log('invalid id')
        }
    } else {
        alert('No customer record with that ID could be found!')
    }
}

const checkVehicleID = async function() {
    let isValid = true;
    let message = ''
    try {
        const id = parseInt(document.querySelector('#vehicle-id').value);
        if (isNaN(id)) return isValid = false;
        else if (id > 0) {
            const result = await getData(`/vehicles?id=${id}`)
            if (result.status) {
                const data = JSON.parse(result.data)[0];
                const price = parseFloat(data.Price).toFixed(2)
                const commission = parseFloat(document.querySelector('#commission').innerHTML).toFixed(2);
                document.querySelector("#subtotal").innerHTML = price;
                document.querySelector("#nettotal").innerHTML = (price - (price * commission)).toFixed(2);
            } else {
                message = result.message;
                isValid = false;
            }
        } else {
            isValid = false;
        }
    } catch(error) {
        isValid = false;
    }
    if (isValid){
        document.querySelector('#save-changes').disabled = false;
    } else {
        alert(message)
    }
}

const saveChanges = async function() {
    let valid = true
    try{
        var eid = parseInt(document.querySelector('#employee-id').value);
        var cid = parseInt(document.querySelector('#customer-id').value);
        var vid = parseInt(document.querySelector('#vehicle-id').value);
        var subtotal = parseFloat(document.querySelector('#subtotal').innerHTML);
        var commission = parseFloat(document.querySelector('#commission').innerHTML)
        valid = validData(eid, cid, vid, subtotal, commission);
    } catch (error) {
        valid = false;
    }
    if (valid) {
        try {
            document.querySelector('#success').style.display = 'none';
            document.querySelector('#failure').style.display = 'none';
            let id = parseInt(document.querySelector('#id-buffer').value);
            const data = await postData('/sales/save', {id, eid, cid, vid, subtotal, commission})
            if (data.status) {
                document.querySelector('#success').style.display = 'block'
                document.querySelector('#id-buffer').value = data.id
                document.querySelector('#heading-section h1').innerHTML = 'Edit Sale Record'
                document.querySelector('#save-changes').innerHTML = 'Save Changes'
            } else {
                document.querySelector('#failure').style.display = 'block'
            }
        }
        catch (error) {
            console.log('[ERROR]', error);
        }
    }
    else {
        alert('Invalid data entered. Please check fields before trying to submit again.')
    }
}
try{
    const id = parseInt(document.querySelector('#id-buffer').value);
    if (id > 0) {
        document.querySelector('#heading-section h1').innerHTML = 'Edit Customer Info'
        const data = JSON.parse(document.querySelector('#hidden-buffer').value);
        let input = document.querySelector('#employee-id');
        input.value = data.EmployeeID ? data.EmployeeID :'NULL';
        input.enabled = true;
        input = document.querySelector('#customer-id');
        input.value = data.CustomerID ? data.CustomerID :'NULL';
        input.enabled = true;
        input = document.querySelector('#vehicle-id');
        input.value = data.VehicleID ? data.VehicleID :'NULL';
        input.enabled = true;
        const subTotal = parseFloat(data.SubTotal).toFixed(2);
        document.querySelector('#subtotal').innerHTML = subTotal
        const commission = parseFloat(data.Commission).toFixed(2);
        document.querySelector('#commission').innerHTML = commission;
        document.querySelector('#nettotal').innerHTML = (subTotal - commission).toFixed(2);
        document.querySelector('#save-changes').disabled = true;
        document.querySelector('#customer-id').disabled = true;
        document.querySelector('#cid-check').disabled = true;
        document.querySelector('#vehicle-id').disabled = true;
        document.querySelector('#vid-check').disabled = true;
    } else {
        document.querySelector('#heading-section h1').innerHTML = 'Create Employee Record'
        document.querySelector('#save-changes').innerHTML = 'Create Record'
        document.querySelector('#save-changes').disabled = true;
        document.querySelector('#customer-id').disabled = true;
        document.querySelector('#cid-check').disabled = true;
        document.querySelector('#vehicle-id').disabled = true;
        document.querySelector('#vid-check').disabled = true;
    }
}
catch (error){
    location.href='/sales'
}
