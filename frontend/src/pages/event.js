import React from 'react';
import Navigation from '../components/navigation';
import EventListTable from '../components/events';

function Event() {
    return (
      <div className="App">
        <Navigation/>
        <header className="Page">
          <EventListTable/>
        </header>
      </div>
    );
}
  
export default Event;