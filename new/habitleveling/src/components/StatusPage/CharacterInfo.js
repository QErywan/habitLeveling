import React from 'react';

const CharacterInfo = ({ userData }) => {

const { Username, JobTitle, Level } = userData;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">STATUS</h1>
      <h2 className="text-xl mb-1">{Username}</h2>
      <p className="text-sm mb-4">Job Title: {JobTitle}</p>
      <div className="flex items-center gap-2 justify-center">
        <span className="text-4xl font-bold">{Level}</span>
        <span className="text-sm">LEVEL</span>
      </div>
    </div>
  );
};

export default CharacterInfo;