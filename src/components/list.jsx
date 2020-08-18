// Import dependencies
import React from 'react'
import { ipcRenderer } from 'electron'

// Create list component
const CreateList = () => {
  let Inititems = []
  const [items, setState] = React.useState(Inititems)
  console.log(items);
  //update state
  ipcRenderer.on('add-quest', (event, questArr) => {
    setState(questArr)
  })

  const handleClick = id => {
    ipcRenderer.send('rm-quest', id)
    setState(items.filter(item => item.id !== id));//change React state
  };

if(items.length === 0){
  return <p> <strong> No question in the queue!!</strong></p>
}else{
  return items.map((item)=>{
    return (
    <li id={item.id}>{item.user} chiede: {item.question} <br/> Contrassegna risposto: <input type="checkbox" onClick = {()=> handleClick(item.id)}/> <br/></li>
    )
  })
}

}

export default CreateList;
