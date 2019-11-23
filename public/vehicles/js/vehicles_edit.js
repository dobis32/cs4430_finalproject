const validData = function(make, model, year, color, price) {
    let isValid = true;
    if(make.length > 16 || model.length > 24 || color.length > 16 || year.length != 4){
        isValid = false;
        console.log('error 1')
    }
    try {
        let parsedYear = parseInt(year);
        let parsedPrice = parseFloat(price).toFixed(2);
        if(parsedYear < 0 || parsedPrice < 0){
            isValid = false;
        }
    } catch(error) {
        isValid = false;
        console.log(error)
    }
    let parsedBuffer = parseFloat(make);
    if (parsedBuffer > 0 || parsedBuffer <= 0){
        isValid = false;
    }
    parsedBuffer = parseFloat(model);
    if (parsedBuffer > 0 || parsedBuffer <= 0){
        isValid = false;
    }
    parsedBuffer = parseFloat(color);
    if (parsedBuffer > 0 || parsedBuffer <= 0){
        isValid = false;
    }          
    return isValid;
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

const saveChanges = async function() {
    const make = document.querySelector('#make').value.toUpperCase();
    const model = document.querySelector('#model').value.toUpperCase();
    const year = document.querySelector('#year').value;
    const color = document.querySelector('#color').value.toUpperCase();
    const price = document.querySelector('#price').value;
    const valid = validData(make, model, year, color, price);
    if (valid) {
        try {
            document.querySelector('#success').style.display = 'none';
            document.querySelector('#failure').style.display = 'none';
            const id = parseInt(document.querySelector('#id-buffer').value);
            const data = await postData('/vehicles/save', {id, make, model, year, color, price})
            if(data.status){
                document.querySelector('#success').style.display = 'block'
            }
            else {
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
        document.querySelector('#heading-section h1').innerHTML = 'Edit Vehicle Info'
        const data = JSON.parse(document.querySelector('#hidden-buffer').value);
        document.querySelector('#make').value = data.Make.toUpperCase();
        document.querySelector('#model').value = data.Model.toUpperCase();
        document.querySelector('#year').value = data.Year;
        document.querySelector('#color').value = data.Color.toUpperCase();
        document.querySelector('#price').value = data.Price;
    }
    else {
        document.querySelector('#heading-section h1').innerHTML = 'Create Vehicle Record'
        document.querySelector('#save-changes').innerHTML = 'Create Record'
    }
}
catch (error){
    alert(error)
    location.href='/vehicles'
}
