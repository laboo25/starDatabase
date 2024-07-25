import React, { useEffect, useState } from 'react';
import './createStarBio.css';
import axios from '../../app/axiosInstance';
import { Select, Input, InputNumber, DatePicker, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateStarBio = () => {
  // const navigate = useNavigate();
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
  const [activeYearEnd, setActiveYearEnd] = useState(null);
  const [ethnicity, setEthnicity] = useState('caucasian');
  const [height, setHeight] = useState(`5'5"`);
  const [hairColor, setHairColor] = useState('brown');
  const [eyeColor, setEyeColor] = useState('black');
  const [shoeSize, setShoeSize] = useState(35);
  const [cupSize, setCupSize] = useState('C');
  const [bustSize, setBustSize] = useState(34);
  const [waistSize, setWaistSize] = useState(24);
  const [hipsSize, setHipsSize] = useState(34);
  const [tattoos, setTattoos] = useState('');
  const [piercings, setPiercings] = useState('');
  const [pubicHair, setPubicHair] = useState('');
  const [boobs, setBoobs] = useState('natural');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('https://stardb-api.onrender.com//api/stars/create-star/get-all-star')
      .then(response => {
        const sortedStars = response.data.sort((a, b) => a.starname.localeCompare(b.starname));
        setStarNames(sortedStars);
      })
      .catch(error => {
        console.error('Error fetching the star names:', error);
        message.error('Error fetching the star names');
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

    axios.post('https://stardb-api.onrender.com//api/stars/star-bio/create-star-bio', starData)
      .then(response => {
        message.success('Star bio created successfully', 5, { top: 0, left: '50%', transform: 'translateX(-50%)' });
        resetForm();
        sessionStorage.setItem('scrollPosition', window.scrollY);
        navigate('/star/:_id');
      })
      .catch(error => {
        console.error('Error creating star bio:', error);
        message.error('Error creating star bio', 5, { top: 0, left: '50%', transform: 'translateX(-50%)' });
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
    setActiveYearEnd(null);
    setEthnicity('caucasian');
    setHeight(`5'5"`);
    setHairColor('brown');
    setEyeColor('black');
    setShoeSize(35);
    setCupSize('C');
    setBustSize(34);
    setWaistSize(24);
    setHipsSize(34);
    setTattoos('');
    setPiercings('');
    setPubicHair('');
    setBoobs('natural');
    setSkills([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const sortOptions = (options) => options.sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div>
      <div>
        <h2 className='capitalize text-[25px] font-bold'>create star bio</h2>
      </div>
      <div onKeyDown={handleKeyDown}>
        <div className='lbl-inpt-wrap'>
          <label>Star name: </label>
          <Select
            className='star-select'
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
        <div className='lbl-inpt-wrap'>
          <label>Add aliases</label>
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
        <div className='lbl-inpt-wrap'>
          <label>Star real name</label>
          <Input
            placeholder="Star real name"
            value={birthName}
            onChange={e => setBirthName(e.target.value)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Birth place</label>
          <Input
            placeholder="Birth place"
            value={birthPlace}
            onChange={e => setBirthPlace(e.target.value)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Birth date</label>
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="Birth date"
            onChange={date => setBirthDate(date ? date.format('YYYY-MM-DD') : null)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Death date</label>
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="Death date"
            onChange={date => setDeathDate(date ? date.format('YYYY-MM-DD') : null)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Occupation</label>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Occupation"
            value={occupation}
            onChange={setOccupation}
            options={[
              { value: 'adult model', label: 'adult model' },
              { value: 'pornstar', label: 'pornstar' },
            ]}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Status</label>
          <Select
            defaultValue="active"
            style={{ width: 120 }}
            onChange={setStatus}
            options={[
              { value: 'active', label: 'active' },
              { value: 'retired', label: 'retired' },
              { value: 'died', label: 'deceased' },
            ]}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Active year start</label>
          <InputNumber
            min={1970}
            max={2550}
            value={activeYearStart}
            onChange={setActiveYearStart}
            placeholder="Active year start"
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Active year end</label>
          <InputNumber
            min={1970}
            max={2530}
            value={activeYearEnd}
            onChange={setActiveYearEnd}
            placeholder="Active year end"
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Ethnicity</label>
          <Select
            defaultValue="caucasian"
            style={{ width: 120 }}
            onChange={setEthnicity}
            options={[
              { value: 'caucasian', label: 'caucasian' },
              { value: 'black', label: 'black' },
              { value: 'asian', label: 'asian' },
              { value: 'latin', label: 'latin' },
              { value: 'indian', label: 'indian' },
              { value: 'mixed caucasian', label: 'middle caucasian' },
              { value: 'mixed black', label: 'mixed black' },
              { value: 'mixed latin', label: 'mixed latin' },
            ]}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Height</label>
          <Input
            placeholder="Height"
            value={height}
            onChange={e => setHeight(e.target.value)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Hair color</label>
          <Select
            defaultValue="brown"
            style={{ width: 120 }}
            onChange={setHairColor}
            options={[
              { value: 'blonde', label: 'blonde' },
              { value: 'brunette', label: 'brunette' },
              { value: 'black', label: 'black' },
              { value: 'brown', label: 'brown' },
              { value: 'red', label: 'red' },
              { value: 'grey', label: 'grey' },
              { value: 'auburn', label: 'auburn' },
              { value: 'blonde', label: 'blonde' },
            ]}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Eye color</label>
          <Select
            defaultValue="black"
            style={{ width: 120 }}
            onChange={setEyeColor}
            options={[
              { value: 'black', label: 'black' },
              { value: 'brown', label: 'brown' },
              { value: 'blue', label: 'blue' },
              { value: 'green', label: 'green' },
              { value: 'grey', label: 'grey' },
              { value: 'hazel', label: 'hazel' },
              { value: 'amber', label: 'amber' },
            ]}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Shoe size</label>
          <InputNumber
            min={1}
            max={50}
            value={shoeSize}
            onChange={setShoeSize}
            placeholder="Shoe size"
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>measurement</label>
          <div className='measurement-inpt w-full flex'>
            <div className=''>
              <InputNumber
                min={20}
                max={50}
                value={bustSize}
                onChange={setBustSize}
                placeholder="Bust size"
                className='w-[70px]'
              />
            </div>
            <Select
              value={cupSize}
              onChange={setCupSize}
              options={[
                { value: 'AA', label: 'AA' },
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' },
                { value: 'D', label: 'D' },
                { value: 'DD', label: 'DD' },
                { value: 'E', label: 'E' },
                { value: 'EE', label: 'EE' },
                { value: 'F', label: 'F' },
                { value: 'G', label: 'G' },
              ]}
              allowClear
              className='w-[70px]'
            />
            <div className=''>
            <InputNumber
              min={20}
              max={50}
              value={waistSize}
              onChange={setWaistSize}
              placeholder="Waist size"
              className='w-[70px]'
            />
          </div>
          <div className=''>
            <InputNumber
              min={20}
              max={50}
              value={hipsSize}
              onChange={setHipsSize}
              placeholder="Hips size"
              className='w-[70px]'
            />
          </div>
          </div>
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Tattoos</label>
          <Input
            placeholder="Tattoos"
            value={tattoos}
            onChange={e => setTattoos(e.target.value)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Piercings</label>
          <Input
            placeholder="Piercings"
            value={piercings}
            onChange={e => setPiercings(e.target.value)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Pubic hair</label>
          <Input
            placeholder="Pubic hair"
            value={pubicHair}
            onChange={e => setPubicHair(e.target.value)}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Boobs</label>
          <Select
            defaultValue="natural"
            style={{ width: 120 }}
            onChange={setBoobs}
            options={[
              { value: 'natural', label: 'natural' },
              { value: 'fake', label: 'fake' },
            ]}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Skills</label>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Skills"
            value={skills}
            onChange={setSkills}
            options={[
              { value: 'anal', label: 'anal' },
              { value: 'bdsm', label: 'bdsm' },
              { value: 'double', label: 'double' },
              { value: 'double anal', label: 'double anal' },
              { value: 'double pussy', label: 'double pussy' },
              { value: 'gangbang', label: 'gangbang' },
              { value: 'triple', label: 'triple' },
              { value: 'foot fetish', label: 'foot fetish' },
              { value: 'fisting', label: 'fisting' },
              { value: 'trans', label: 'trans' },
            ]}
            allowClear
          />
        </div>
        <Button className='bg-blue-600 w-full my-5' type="primary" onClick={handleSubmit} loading={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateStarBio;
