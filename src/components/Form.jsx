// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"import Button from "./Button";

import "react-datepicker/dist/react-datepicker.css"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useURLPosition } from '../hooks/useURLPosition'
import { useCities } from "../contexts/CitiesContext";
import DatePicker from "react-datepicker"
import Message from "./Message";
import Button from "./Button";
import BackButton from "./BackButton";
import styles from "./Form.module.css";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
  .toUpperCase()
  .split("")
  .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {
  const [lat, lng] = useURLPosition()
  const {createCity, isLoading} = useCities()
  const navigate = useNavigate()

  const [isLoadingGeocoding, setIsLoadingGeolocation] = useState(false)
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("")

  useEffect(() => {
    if (!lat && lng) return;

    async function fetchCityData() {
      try {
        setIsLoadingGeolocation(true)
        setGeocodingError("")
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()
        console.log(data)

        if (!data.countryCode) throw new Error("It doesn't seem to be a city. Click somewhere else ;")
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode))

      } catch(err) {
        setGeocodingError(err.message)
      } finally {
        setIsLoadingGeolocation(false)
      }
    }
    fetchCityData()
  }, [lat, lng])



  async  function handleSubmit (e) {
    e.preventDefault()
    if (!cityName || !date) return

    const newCity = {
      // id automatically generated by the json-server
      cityName, 
      country, 
      emoji, 
      date, 
      notes, 
      position: { lat, lng }
    }
   
    await createCity(newCity)
    navigate("/app/cities")
   
  }

  if (isLoadingGeocoding) return <Spinner/>

  if (geocodingError) return <Message message={geocodingError} />

  if (!lat && !lng) return <Message message="Start by clicking somewhere on the map ;"/>

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">{cityName}</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
      
        <DatePicker
         id="date"
         onChange={date => setDate(date)} 
         selected={date} 
         dateFormat="dd/MM/yyyy"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton/>
      </div>
    </form>
  );
}

export default Form;
