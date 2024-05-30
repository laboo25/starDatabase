import React, { useEffect, useState } from 'react';
import './createStarBio.css';
import axios from '../../app/axiosInstance';
import { Select, Input, InputNumber, DatePicker, Button, message } from 'antd';
// import { useNavigate } from 'react-router-dom';

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
    axios.get('https://stardb-api.onrender.com/api/stars/create-star/get-all-star')
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

    axios.post('https://stardb-api.onrender.com/api/stars/star-bio/create-star-bio', starData)
      .then(response => {
        message.success('Star bio created successfully', 5, { top: 0, left: '50%', transform: 'translateX(-50%)' });
        resetForm();
        sessionStorage.setItem('scrollPosition', window.scrollY);
        // navigate('/path-to-redirect');
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
            options={sortOptions([
              { value: 'adult model', label: 'adult model' },
              { value: 'pornstar', label: 'pornstar' },
            ])}
            allowClear
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Status</label>
          <Select
            defaultValue="active"
            style={{ width: 120 }}
            onChange={setStatus}
            options={sortOptions([
              { value: 'active', label: 'active' },
              { value: 'retired', label: 'retired' },
              { value: 'deceased', label: 'deceased' },
            ])}
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Active year start</label>
          <InputNumber
            placeholder="Active year start"
            value={activeYearStart}
            onChange={setActiveYearStart}
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Active year end</label>
          <InputNumber
            placeholder="Active year end"
            value={activeYearEnd}
            onChange={setActiveYearEnd}
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Ethnicity</label>
          <Select
            defaultValue="caucasian"
            style={{ width: 120 }}
            onChange={setEthnicity}
            options={sortOptions([
              { value: 'caucasian', label: 'caucasian' },
              { value: 'black', label: 'black' },
              { value: 'asian', label: 'asian' },
              { value: 'latin', label: 'latin' },
              { value: 'indian', label: 'indian' },
              { value: 'middle eastern', label: 'middle eastern' },
              { value: 'native american', label: 'native american' },
              { value: 'pacific islander', label: 'pacific islander' },
            ])}
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
            options={sortOptions([
              { value: 'blonde', label: 'blonde' },
              { value: 'brunette', label: 'brunette' },
              { value: 'black', label: 'black' },
              { value: 'brown', label: 'brown' },
              { value: 'red', label: 'red' },
              { value: 'grey', label: 'grey' },
              { value: 'bald', label: 'bald' },
              { value: 'dyed', label: 'dyed' },
            ])}
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Eye color</label>
          <Select
            defaultValue="black"
            style={{ width: 120 }}
            onChange={setEyeColor}
            options={sortOptions([
              { value: 'black', label: 'black' },
              { value: 'brown', label: 'brown' },
              { value: 'blue', label: 'blue' },
              { value: 'green', label: 'green' },
              { value: 'grey', label: 'grey' },
              { value: 'hazel', label: 'hazel' },
            ])}
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Shoe size</label>
          <InputNumber
            placeholder="Shoe size"
            value={shoeSize}
            onChange={setShoeSize}
          />
        </div>
        <div className='lbl-inpt-wrap'>
          <label>Measurements</label>
          <Input
            placeholder="Cup size"
            value={cupSize}
            onChange={e => setCupSize(e.target.value)}
            allowClear
          />
          <Input
            placeholder="Bust size"
            value={bustSize}
            onChange={e => setBustSize(e.target.value)}
            allowClear
          />
          <Input
            placeholder="Waist size"
            value={waistSize}
            onChange={e => setWaistSize(e.target.value)}
            allowClear
          />
          <Input
            placeholder="Hips size"
            value={hipsSize}
            onChange={e => setHipsSize(e.target.value)}
            allowClear
          />
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
            options={sortOptions([
              { value: 'natural', label: 'natural' },
              { value: 'fake', label: 'fake' },
            ])}
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
            options={sortOptions([
              { value: 'acting', label: 'acting' },
              { value: 'dancing', label: 'dancing' },
              { value: 'singing', label: 'singing' },
              { value: 'stunts', label: 'stunts' },
            ])}
            allowClear
          />
        </div>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!selectedStar || loading}
        >
          Create Star Bio
        </Button>
      </div>
    </div>
  );
};

export default CreateStarBio;

