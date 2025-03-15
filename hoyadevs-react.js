import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const supabase = createClient('https://noqwtwymzmgozfjdylxz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vcXd0d3ltem1nb3pmamR5bHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDQwOTAsImV4cCI6MjA1NzQ4MDA5MH0.8lCJhHQLvxaohMwWNDBf6QO9Tp-I7s591xjD0tNqV94');

const LoginPage = ({ setUserType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (type) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else setUserType(type);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">HoyaDevs Alumni Connection</h1>
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={() => handleLogin('alumni')} className="mt-2">Login as Alumni</Button>
      <Button onClick={() => handleLogin('member')} className="mt-2">Login as Current Member</Button>
    </div>
  );
};

const AlumniForm = ({ addAlumni }) => {
  const [formData, setFormData] = useState({
    name: '', pronouns: '', graduation_year: '', school: '', major: '', minor: '', certificates: '', 
    semesters: '', hoyadevs_projects: '', clubs: '', experiences: '', current_role: '', 
    email: '', linkedin: '', coffee_chat: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('alumni').insert([formData]);
    addAlumni(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <Input name="pronouns" placeholder="Pronouns" value={formData.pronouns} onChange={handleChange} />
      <Input name="graduation_year" type="date" placeholder="Graduation Year" value={formData.graduation_year} onChange={handleChange} />
      <Input name="school" placeholder="School" value={formData.school} onChange={handleChange} />
      <Input name="major" placeholder="Major" value={formData.major} onChange={handleChange} />
      <Input name="minor" placeholder="Minor" value={formData.minor} onChange={handleChange} />
      <Input name="certificates" placeholder="Certificates" value={formData.certificates} onChange={handleChange} />
      <Input name="semesters" placeholder="Semesters in HoyaDevs" value={formData.semesters} onChange={handleChange} />
      <Textarea name="hoyadevs_projects" placeholder="HoyaDevs Projects" value={formData.hoyadevs_projects} onChange={handleChange} />
      <Textarea name="clubs" placeholder="Other Clubs" value={formData.clubs} onChange={handleChange} />
      <Textarea name="experiences" placeholder="College Experiences" value={formData.experiences} onChange={handleChange} />
      <Input name="current_role" placeholder="Current Role" value={formData.current_role} onChange={handleChange} />
      <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <Input name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} />
      <label>
        <input type="checkbox" name="coffee_chat" checked={formData.coffee_chat} onChange={handleChange} /> Available for Coffee Chat
      </label>
      <Button type="submit">Submit</Button>
    </form>
  );
};

const AlumniList = () => {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    const fetchAlumni = async () => {
      let { data, error } = await supabase.from('alumni').select('*');
      if (error) console.log(error);
      else setAlumni(data);
    };
    fetchAlumni();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {alumni.map((person, index) => (
        <Card key={index} className="p-4">
          <CardContent>
            <h3 className="text-xl font-bold">{person.name} ({person.pronouns})</h3>
            <p>Graduation Year: {person.graduation_year}</p>
            <p>Major: {person.major} | Minor: {person.minor} | Certificates: {person.certificates}</p>
            <p>Current Role: {person.current_role}</p>
            <p>Available for Coffee Chat: {person.coffee_chat ? 'Yes' : 'No'}</p>
            <a href={`mailto:${person.email}`} className="text-blue-500">Email</a>
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500">LinkedIn</a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const HoyaDevsApp = () => {
  const [userType, setUserType] = useState(null);

  if (!userType) return <LoginPage setUserType={setUserType} />;
  
  return (
    <div className="container mx-auto p-4">
      {userType === 'alumni' ? <AlumniForm /> : <AlumniList />}
    </div>
  );
};

export default HoyaDevsApp;
