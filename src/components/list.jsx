// Import dependencies
import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import getLang from '../js/langLib';

// Create list component
const CreateList = () => {
  const langObj = getLang()
  let Inititems = []
  const [items, setState] = React.useState(Inititems)
  console.log(items);

  //update state
  useEffect(()=>{
    ipcRenderer.send('fetch-question-list')//call the main to fetch list
  }, [items])

  //on main response
  ipcRenderer.on('list-response', (event , questArr)=>{
    setState(questArr)
  })

  ipcRenderer.on('add-quest', (event, questArr) => {
    setState(questArr)
  })

  const handleClick = id => {
    ipcRenderer.send('rm-quest', id)
    setState(items.filter(item => item.id !== id));//change React state
  };

  if (items.length === 0) {
    return (<div class="center-panel">
      <p class='section'>{langObj.labels[0]}</p>
      <ul><p><strong>{langObj.labels[1]}</strong></p></ul>
    </div>)
  } else {
    return (
      <div class="center-panel">
        <p class='section'>{langObj.labels[0]}</p>
        <ul>
          {items.map((item) => {
            return (
            <li class="genericQuest" id={item.id}><strong>{item.user}</strong> in <strong>[{item.channel}]</strong> <p class="askPrefix">chiede</p>  :  {item.question} <input type="button" class="doneBtn" value="Done" onClick={() => handleClick(item.id)} /> <br /></li>
            )
          })}
        </ul>
      </div>
    )
  }

}

export default CreateList;
