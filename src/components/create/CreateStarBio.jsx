import React, { useEffect, useState } from 'react';
import './bio.css'
import axios from 'axios';
import { Select, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { useNavigate  } from 'react-router-dom';

const CreateStarBio = () => {
  const history = useNavigate ();
  const [scrollPosition, setScrollPosition] = useState(0);

  const [starNames, setStarNames] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [aliases, setAliases] = useState([]);
  const [birthName, setBirthName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [deathDate, setDeathDate] = useState(null);
  const [occupation, setOccupation] = useState([]);
  const [status, setStatus] = useState('active');
  const [activeYearStart, setActiveYearStart] = useState(2010);
  const [activeYearEnd, setActiveYearEnd] = useState(2022);
  const [ethnicity, setEthnicity] = useState('caucasian');
  const [height, setHeight] = useState(`5'5"`);
  const [hairColor, setHairColor] = useState('brown');
  const [eyeColor, setEyeColor] = useState('black');
  const [shoeSize, setShoeSize] = useState(35);
  const [cupSize, setCupSize] = useState('C');
  const [bustSize, setBustSize] = useState(34);
  const [waistSize, setWaistSize] = useState(24);
  const [hipsSize, setHipsSize] = useState(36);
  const [tattoos, setTattoos] = useState('');
  const [piercings, setPiercings] = useState('');
  const [pubicHair, setPubicHair] = useState('');
  const [boobs, setBoobs] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star')
      .then(response => {
        const sortedStars = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
        setStarNames(sortedStars);
      })
      .catch(error => {
        console.error('Error fetching the star names:', error);
      });
  }, []);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sessionStorage.setItem('scrollPosition', window.scrollY);
    };
  }, []);

  const handleSubmit = () => {
    if (!selectedStar) {
      message.error('Please select a star.');
      return;
    }

    setLoading(true);

    const starData = {
      starname: selectedStar,
      aliases: aliases.length > 0 ? aliases : null,
      birthname: birthName || null,
      birthplace: birthPlace || null,
      birthdate: birthDate,
      deathdate: deathDate,
      occupation: occupation.length > 0 ? occupation : null,
      status,
      start: activeYearStart || null,
      end: activeYearEnd,
      ethnicity: ethnicity || null,
      height: height || null,
      hair: hairColor || null,
      eyes: eyeColor || null,
      shoesize: shoeSize || null,
      measurement: [{
        cup: cupSize || null,
        bust: bustSize || null,
        waist: waistSize || null,
        hips: hipsSize || null,
      }],
      tattoos: tattoos || null,
      piercings: piercings || null,
      skills: skills.length > 0 ? skills : null,
      pubic: pubicHair || null,
      boobs: boobs || null,
    };

    axios.post('https://stardb-api.onrender.com/api/stars/star-bio/create-star-bio', starData)
      .then(response => {
        message.success('Star bio created successfully');
        resetForm();
      })
      .catch(error => {
        console.error('Error creating star bio:', error);
        message.error('Error creating star bio');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetForm = () => {
    setSelectedStar(null);
    setAliases([]);
    setBirthName('');
    setBirthPlace('');
    setBirthDate(null);
    setDeathDate(null);
    setOccupation([]);
    setStatus('active');
    setActiveYearStart(2010);
    setActiveYearEnd(2022);
    setEthnicity('caucasian');
    setHeight('5.5');
    setHairColor('brown');
    setEyeColor('black');
    setShoeSize(9);
    setCupSize('C');
    setBustSize(34);
    setWaistSize(24);
    setHipsSize(36);
    setTattoos('');
    setPiercings('');
    setPubicHair('');
    setBoobs('');
    setSkills([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const sortOptions = (options) => options.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div id='addBio' onKeyDown={handleKeyDown} style={{width: "500px", display: "flex", flexDirection: "column", flexWrap: "wrap"}}>
      <div style={{width: "auto", display: "flex"}}>
        <label>Select a star</label>
        <Select
          showSearch
          placeholder="Select a star"
          optionFilterProp="children"
          onChange={setSelectedStar}
          allowClear
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          options={starNames.map(star => ({
            value: star._id,
            label: star.starname,
          }))}
        />
      </div>
      <div style={{ marginTop: '20px', width: "500px", display: "flex" }}>
        <label>aliases</label>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add aliases"
          value={aliases}
          onChange={setAliases}
          tokenSeparators={[',']}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Star real name</label>
        <Input
          placeholder="Star real name"
          value={birthName}
          onChange={e => setBirthName(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Birth place</label>
        <Input
          placeholder="Birth place"
          value={birthPlace}
          onChange={e => setBirthPlace(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Birth date</label>
        <DatePicker
          format="YYYY-MM-DD"
          placeholder="Birth date"
          onChange={date => setBirthDate(date ? date.format('YYYY-MM-DD') : null)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Death date</label>
        <DatePicker
          format="YYYY-MM-DD"
          placeholder="Death date"
          onChange={date => setDeathDate(date ? date.format('YYYY-MM-DD') : null)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Occupation</label>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Occupation"
          value={occupation}
          onChange={setOccupation}
          options={sortOptions([
            { value: 'adult model', label: 'adult model' },
            { value: 'pornstar', label: 'pornstar' },
          ])}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Status</label>
        <Select
          defaultValue="active"
          style={{ width: 120 }}
          onChange={setStatus}
          options={sortOptions([
            { value: 'active', label: 'active' },
            { value: 'retired', label: 'retired' },
            { value: 'died', label: 'died' },
          ])}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Active Year Start</label>
        <InputNumber
          defaultValue={2010}
          onChange={value => setActiveYearStart(value !== null ? value : null)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Active Year End</label>
        <InputNumber
          defaultValue={2022}
          onChange={value => setActiveYearEnd(value !== null ? value : null)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Ethnicity</label>
        <Select
          defaultValue="caucasian"
          style={{ width: 120 }}
          onChange={setEthnicity}
          options={sortOptions([
            { value: 'caucasian', label: 'caucasian' },
            { value: 'mixed', label: 'mixed' },
            { value: 'latin', label: 'latin' },
            { value: 'mixed-caucasian', label: 'mixed-caucasian' },
            { value: 'mixed-latin', label: 'mixed-latin' },
            { value: 'black', label: 'black' },
            { value: 'mixed-black', label: 'mixed-black' },
          ])}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Height</label>
        <Input
          placeholder="Height"
          value={height}
          onChange={e => setHeight(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Hair Color</label>
        <Select
          defaultValue="brown"
          style={{ width: 120 }}
          onChange={setHairColor}
          options={sortOptions([
            { value: 'black', label: 'black' },
            { value: 'brown', label: 'brown' },
            { value: 'blonde', label: 'blonde' },
            { value: 'red', label: 'red' },
            { value: 'green', label: 'green' },
          ])}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Eye Color</label>
        <Select
          defaultValue="black"
          style={{ width: 120 }}
          onChange={setEyeColor}
          options={sortOptions([
            { value: 'black', label: 'black' },
            { value: 'brown', label: 'brown' },
            { value: 'blue', label: 'blue' },
            { value: 'green', label: 'green' },
            { value: 'red', label: 'red' },
            { value: 'hazel', label: 'hazel' },
          ])}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Shoe Size</label>
        <InputNumber
          min={4}
          max={50}
          defaultValue={9}
          onChange={value => setShoeSize(value !== null ? value : null)}
          allowClear
        />
      </div>
                  {/* Measurement */}
      <div style={{ marginTop: '20px', width: "auto", display: "flex", gap: "20px" }}>
        <label>Measurement: </label>
        <InputNumber
          min={4}
          max={50}
          defaultValue={34}
          onChange={value => setBustSize(value !== null ? value : null)}
          allowClear
          style={{width: '90px'}}
        />
        <Input
          placeholder="Cup Size"
          value={cupSize}
          onChange={e => setCupSize(e.target.value)}
          allowClear
          style={{width: "60px"}}
        />
        {/* add select option for cup size instead of input */}
        <InputNumber
          min={4}
          max={50}
          defaultValue={24}
          onChange={value => setWaistSize(value !== null ? value : null)}
          allowClear
          style={{width: '90px'}}
        />
        <InputNumber
          min={4}
          max={50}
          defaultValue={36}
          onChange={value => setHipsSize(value !== null ? value : null)}
          allowClear
          style={{width: '90px'}}
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Tattoos</label>
        <Input
          placeholder="Tattoos"
          value={tattoos}
          onChange={e => setTattoos(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Piercings</label>
        <Input
          placeholder="Piercings"
          value={piercings}
          onChange={e => setPiercings(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Pubic Hair</label>
        <Input
          placeholder="Pubic hair"
          value={pubicHair}
          onChange={e => setPubicHair(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Boobs</label>
        <Input
          placeholder="Boobs"
          value={boobs}
          onChange={e => setBoobs(e.target.value)}
          allowClear
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <label>Skills</label>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Skills"
          value={skills}
          onChange={setSkills}
          options={sortOptions([
            { value: 'anal', label: 'anal' },
            { value: 'bdsm', label: 'bdsm' },
            { value: 'feet fetish', label: 'feet fetish' },
            { value: 'double', label: 'double' },
            { value: 'double anal', label: 'double anal' },
            { value: 'double vaginal', label: 'double vaginal' },
            { value: 'triple penetration', label: 'triple penetration' },
            { value: 'trans', label: 'trans' },
          ])}
        />
      </div>
      <div style={{ marginTop: '20px', width: "auto", display: "flex" }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{ display: 'block', margin: '0 auto', background: "blue" }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateStarBio;
