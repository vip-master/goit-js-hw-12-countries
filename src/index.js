import "./styles.css"
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import debounce from "lodash.debounce"
import { error } from '@pnotify/core/dist/PNotify.js';

import tmain from "./tempaltes/main.hbs"
import titem from "./tempaltes/small.hbs"

const input = document.querySelector("input")
const contry = document.querySelector("article")
const contries = document.querySelector(".several")
let alert

const clear = () => {
    contry.innerHTML = ""
    contries.innerHTML = ""
    if (alert)
        if (alert.close) {
            alert.close()
            alert = false
            input.classList.remove("alert")
        }
}

const openAlert = ({ title, text }) => {
    input.classList.add("alert")
    if (alert)
        if (alert.close) alert.close()
    alert = error({
        title,
        text,
        delay: Infinity,

    });
}

const find = debounce(() => {
    clear()
    if (input.value) {
        fetch(`https://restcountries.eu/rest/v2/name/${input.value}`)
            .then(res => (+res.status) / 100 === 2 ? res.json() : openAlert({
                title: `Error ${res.status}`,
                text: res.statusText
            }))
            .then(data => {
                (!data) ? "" :
                (data.length > 1 && data.length < 11) ?
                contries.innerHTML = titem(data):
                    (data.length === 1) ?
                    contry.innerHTML = tmain(data[0]) :
                    (data.length > 11) ?
                    openAlert({
                        title: "Too many matches found. Please enter a more specific query!"
                    }) : ""
            })
            .catch(err => {
                openAlert({
                    title: "Error!",
                    text: err
                })
            })
    }
}, 500)

input.addEventListener("input", find)

contries.addEventListener("click", e => {
    if (e.target === e.currentTarget) return

    input.value = e.target.textContent
    find()
})