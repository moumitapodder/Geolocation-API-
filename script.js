let dataObj = {};
let lightMode = true;
const btnToggle = document.querySelector(".toggle");

//promise for fetching data
const getCurrentPosition = () => {//getcurrentPosition is a method that is used to fetch your cureent location it contains three parameter one is showlocation,error,options.
    return new Promise((resolve, reject) => {// executor function is a promise
        navigator.geolocation.getCurrentPosition((data) => {
            resolve(data);
        }, (error) => {
            reject(error);//if you block the message then the code will return to reject
        });
    });

}

btnToggle.addEventListener('click', () => {
    const detailSection = document.querySelector(".details");
    lightMode = !lightMode;
    lightMode ? detailSection.classList.remove("dark") : detailSection.classList.add("dark");
    lightMode ? btnToggle.classList.add("btn-dark") : btnToggle.classList.remove("btn-dark");
    btnToggle.innerHTML = lightMode ? "Dark" : "Light";
});

const reset = () => {
    let details = document.querySelector(".details");
    btnToggle.classList.remove("hide");
    btnToggle.classList.add("show");
    btnToggle.classList.add("btn-dark");
    if (details) {
        details.remove();
    }
    btnToggle.innerHTML = "Dark";
}

const renderLocationDetails = (data) => {
    const { city, state, postal, country, flag } = data;
    let htmlStr = `<div class="details">
    <div class="item">City:<span class="pl-10">${city}</span></div> 
    <div class="item">State:<span class="pl-10">${state}</span></div>
    <div class="item">Postal:<span class="pl-10">${postal}</span></div>
    <div class="item">Country:<span class="pl-10">${country}</span></div>
    <div class="item"><img src="${flag}" alt=""></div>
</div>`;

   reset();   
    document.querySelector(".container").insertAdjacentHTML("beforeend", htmlStr);


}

//then is used in promise object to handle the resolve and reject part
const getLocationDetails = async (lat, long) => { //await is a keyword which will make wait the code after promise and it will only run in asynchronous function
    let url = `https://geocode.xyz/${lat},${long}?geoit=json&auth=657344044874692557074x73235`;
    const resp = await fetch(url);
    return resp.json();//it is used to send data from server to a web page.....
}

const getCountryData = async (country) => {
    let url = `https://restcountries.com/v3.1/name/${country}`;
    const resp = await fetch(url);
    return resp.json();
}

const btn = document.querySelector(".btn");
btn.addEventListener('click', () => {
    getCurrentPosition()
        .then((data) => {
            const { latitude: lat, longitude: long } = data.coords;//coords is the x-axix and y-axis.
            return getLocationDetails(lat, long);
        })
        .then((data) => {
            const { city, country, state, postal } = data;
            dataObj = { city, country, state, postal };
            console.log(dataObj);
            return getCountryData(country);
        }, (error) => {
        })
        .then((data) => {
            const { flags } = data[0];
            console.log(flags);
            Object.assign(dataObj, { flag: flags.png });
            renderLocationDetails(dataObj);
            console.log(dataObj);
        }, (error) => {

        })
        .catch((error) => {

        });
});