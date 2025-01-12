import React, { useEffect, useState } from 'react';
import { useTable, useSortBy } from 'react-table'
import "../styles/table.css";
const { default: axios } = require('axios');
let value=null;
let oldValue=null;
var yes=false;
var password=false;
var del=false;
let component=null;

export default function EventTables(){
  return(
    <div>
      <EventModifTable/>
      <div className="theButton">
          <button className="addBut" id="addBut" onClick={() => handleAdd()}> + </button>
      </div>
      <div className="addEvent" id="addEvent">
          <AddEvent />
          <div class="fix"></div>
      </div>
      <EventListTable/>
      
    </div>
  )
}

// A card used to contain all data from api
function EventListTable(){

    const [dat, setDat] = useState([]);

    const fetchDat = async () => {
        //console.log("coucou2")
        await axios.get('http://localhost:9000/albums').then(all => 
                {
                    //console.log("coucou4")
                    //console.log(all.data[0])
                    const tab = []
                    for (let i = 0; i < all.data.length; i++) {
                        const actual = 
                        {
                            Title: all.data[i].Album.Title,
                            ImageCount: all.data[i].Album.ImageCount,
                            LastUpdated: all.data[i].Album.LastUpdated,
                            Public: JSON.stringify(all.data[i].Album.Public),
                            URL: ClickLink(all.data[i].Album.URL)
                        };
                        tab.push(actual)
                        //console.log(actual)
                    }
                    setDat(tab);
                }
            );
            //console.log("coucou3")
    }

    useEffect(() => {
        //console.log("coucou")
        fetchDat();
        
        //console.log( {dat} );
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Titre',
                accessor: 'Title'
            },
            {
                Header: 'Nombre Images',
                accessor: 'ImageCount'
            },
            {
                Header: 'Dernière modification',
                accessor: 'LastUpdated'
            },
            {
                Header: 'Accessible',
                accessor: 'Public'
            },
            {
                Header: 'Lien',
                accessor: 'URL'
            },
        ]
    );


    return (
      <>
        <Table className='tableInside' columns={columns} data={dat}/>
        
      </>
    );
}

function handleAdd(){
  //let add = document.getElementById("add");
  let add = document.getElementById("addEvent");
    if(add.style.display!="flex"){
      add.style.display = "flex";
      document.getElementById("addBut").innerHTML='-';
      console.log("on affiche");
    }
    else{
      add.style.display = "none";
      document.getElementById("addBut").innerHTML='+';
    }
    
}

function ClickLink(params){
    return <td contentEditable="false" className="lien" onClick={()=> window.open(params, "_blank")}>Cliquer ici pour acceder</td>;
}

function EventModifTable(){
  const [dat, setDat] = useState([]);
    
    const fetchDat = async () => {
        //console.log("coucou2")
        await axios.get('http://localhost:9000/events/all').then(all => 
                {
                    const tab = []
                    for (let i = 0; i < all.data.length; i++) {
                        const actual = 
                        {
                            Event: all.data[i].event,
                            Date: all.data[i].date,
                            PositionName: all.data[i].position.name,
                            Couvreurs: all.data[i].couvreurs
                        };
                        tab.push(actual)
                        //console.log(actual)
                    }
                    setDat(tab);
                }
            );
            //console.log("coucou3")
    }

    useEffect(() => {
        //console.log("coucou")
        fetchDat();
        
        //console.log( {dat} );
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Event',
                accessor: 'Event'
            },
            {
                Header: 'Date',
                accessor: 'Date'
            },
            {
                Header: 'Position',
                accessor: 'PositionName'
            },
            {
                Header: 'Couvreurs',
                accessor: 'Couvreurs'
            }
        ]
    );


    return (
      <>
        <PopUp />
        <TableModif className='tableInside' columns={columns} data={dat} />
      </>
    );
}

function PopUp(params, dvalue){
  return(
    <div id="pop-up"> 
      <div id="content"> Do you really want to change 1 by 2 ? </div>
      <div className="buttons">
        <button id="yes" onClick={() => sendData()}> Yes </button>
        <button id="no" onClick={() => handleChange(-1,-1)}> No </button>
      </div>
    </div>
  );
}

function AddEvent(){
  const events ={
    event: "",
    date: "",
    position: "",
    couvreurs: [{name : ""}],
  }

  const handleFormChangeE = (e) =>{
    events.event=e.target.value;
  }

  const handleFormChangeD = (e) =>{
    events.date=e.target.value;
  }

  const handleFormChangeP = (e) =>{
    events.position=e.target.value;
  }

  const handleFormChangeC = (e) =>{
    events.couvreurs=e.target.value.split(' ');
  }
  
  const send = async (e) => {
    //alert(events.event + " " + events.date + " " +events.position + " " +events.couvreurs);
    let link='http://localhost:9000/events?event=' + events.event + '&date=' + events.date + '&name=' + events.position + '&lat=0&lng=0';
    for(let i=0; i<events.couvreurs.length; i++){
      link=link + '&couvreurs= ' + events.couvreurs[i];
    }
    await axios.post(link);
  }

  let year=new Date();
  return (
    <div id="add">
      <h3>Add an Event</h3>
      <form onSubmit={(event) => send(event)}>
        <input type="text" placeholder="Event Name" name="event" onBlur={(e) => handleFormChangeE(e)} required/>
        <div className="date">
          <label>Date of the event</label>
          <input type="date" name="date" onBlur={(e) => handleFormChangeD(e)} required/>
        </div>
        <input type="text" placeholder="Place of the Event" name="position" onBlur={(e) => handleFormChangeP(e)} required/>
        <input type="text" placeholder="Couvreurs" name="couvreurs" onBlur={(e) => handleFormChangeC(e)} required/>
        <input id="submit" type="submit" value="SUBMIT" required/>
      </form>
    </div>
  )
}



function sendData(){
  if(password==true && del==true){
    //on supp
    console.log("on supp: " + oldValue);
    axios.post('http://localhost:9000/events/delete/' + JSON.stringify({event:oldValue.slice(0,oldValue.length-1)}));
    /*axios.post('http://localhost:9000/events/any/' + JSON.stringify({event:oldValue.slice(0,oldValue.length-1)})
      +'?to='+JSON.stringify({event: value}));*/
  }
  if(password==false && del==true){
    var data="Enter Password:<br></br><input id='password' type='password' placeholder='Password'>";
    document.getElementById("content").innerHTML = data;
    document.getElementById("yes").innerHTML = "Delete";
    document.getElementById("no").innerHTML = "Cancel";
    password=true;
  }
  else if(password==false){
    console.log("database: " + oldValue + " nouvelle: " + value);
    //on se connecte à la db
    //on trouve lelement qui correspond à oldValue,
    //Si on trouve on demande un mot de passe => on modifie la valeur dans la db
    var data="Enter Password:<br></br><input id='password' type='password' placeholder='Password'>";
    document.getElementById("content").innerHTML = data;
    document.getElementById("yes").innerHTML = "Send";
    document.getElementById("no").innerHTML = "Cancel";
    password=true;
  }
  //We update the data
  else if(password==true && del==false){
    console.log(document.getElementById("password").value);
    password=false;
    let popUp = document.getElementById("pop-up");
    popUp.style.display = "none";
    yes=false;
    del=false;

    console.log("on update");
    axios.post('http://localhost:9000/events/any/' + oldValue.slice(0,oldValue.length-1) +'?to='+value);

    //We set back the buttons setup
    document.getElementById("yes").innerHTML = "Yes";
    document.getElementById("no").innerHTML = "No";
  }
  else{
    password=false;
    let popUp = document.getElementById("pop-up");
    popUp.style.display = "none";
    yes=false;
    del=false;

    //We set back the buttons setup
    document.getElementById("yes").innerHTML = "Yes";
    document.getElementById("no").innerHTML = "No";
  }
  
}

async function handleChange(params, dvalue){
  if(params!=dvalue && dvalue!=null && yes==false && params!='' && dvalue!='' && params!='Cliquer ici pour acceder' && dvalue!='Cliquer ici pour acceder'){
    console.log("on rentre dans la boucle " + params + " " + dvalue);
    //return <div className="pop-up">Do you Really want to change ${dvalue} by ${params} ? </div>
    let popUp = document.getElementById("pop-up");
    if(popUp.style.display!="flex"){
      popUp.style.display = "flex";
      console.log("on affiche");
    }
      
      document.getElementById("content").innerHTML = "Do you Really want to change " + dvalue + " by " + params + " ?";
      oldValue=dvalue;
      value=params;
      yes=true;
      console.log("dans la fonction old: " + oldValue + " / nouv: " + value );
  }
  else if(params==-1){
    console.log("on ferme");
    let popUp = document.getElementById("pop-up");
    popUp.style.display = "none";
    yes=false;
    del=false;
    console.log("component: " + component.textContent);
    component.innerHTML=oldValue;
    console.log("component: " + component.textContent);
    
    if(password==true){
      //We set back the buttons setup
      document.getElementById("yes").innerHTML = "Yes";
      document.getElementById("no").innerHTML = "No";
      password=false;
      //We update in the database
      //axios.post()
    }
    
  }
  else if(params==''){
    document.getElementById("content").innerHTML = "Are you sure you want to delete the event " + dvalue + " ?";
    del=true;
    let popUp = document.getElementById("pop-up");
    popUp.style.display = "flex";
    oldValue=dvalue;
      //axios.post('http://localhost:9000/events/delete/' + JSON.stringify({event: dvalue}));
    //component.innerHTML=dvalue;
  }
  else if(dvalue==''){
    component.innerHTML=params;
  }
  
}

//Code taken from the exemple presentation for react-table
function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
      },
      useSortBy
    )

    let lol=null;
  
    return (
      <>
        <table className="tableau"  {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span >
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(
              (row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        //<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        <td className="cellule" {...cell.getCellProps()}>
                          <div >{cell.render('Cell')} </div>
                        </td>
                        //<div contentEditable onClick={(truc) => {lol=truc.target.textContent; component=truc.currentTarget; console.log("on a " + component.textContent)}} onBlur={(truc)=> handleChange(truc.target.textContent,lol)}>{cell.render('Cell')} </div>
                        //<input type="text" className="edit" defaultValue={cell.value} onBlur={(truc)=> console.log(truc.target.value)} />
                      )
                    })}
                  </tr>
                )}
            )}
          </tbody>
        </table>
        <br />
      </>
    )
  }

//Code taken from the exemple presentation for react-table
function TableModif({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  let lol=null;

  return (
    <>
      <table className="tableau" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span >
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      //<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      <td className="cellule" {...cell.getCellProps()}>
                        <div contentEditable onClick={(truc) => {lol=truc.target.textContent; if(yes==false)component=truc.currentTarget; console.log("on a " + component.textContent)}} onBlur={(truc)=> handleChange(truc.target.textContent,lol)}>{cell.render('Cell')} </div>
                      </td>
                      //<input type="text" className="edit" defaultValue={cell.value} onBlur={(truc)=> console.log(truc.target.value)} />
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
      <br />
    </>
  )
}