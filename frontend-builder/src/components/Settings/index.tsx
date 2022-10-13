import React, { useState } from 'react'
import Icons8 from '../assets/icons8-info-50.png'


  const Board = [
    { key: 'star-this-board', value: 'Star this board' },
    { key: 'copy-board', value: 'Copy this board' },
    { key: 'move-this-board', value: 'Move this board to other projects' },
    { key: 'set-start-view', value: 'Set start view' },
    { key: 'board-history', value: 'Board history' },
  ];
  const Prefer = [
    { key: 'navigate-device', value: 'Navigation device' },
    { key: 'grid', value: 'Grid' },
    { key: 'align-objects', value: 'Align objects' },
    { key: 'scroll-bar', value: 'Scroll Bar' },
    { key: 'object-dim', value: 'Object dimensions' },
  ];
  const Short = [{ key: 'shortcuts', value: 'Shortcuts' }];
  const Follow = [{ key: 'follow-all', value: 'Follow all threads' }];
  const Interact = [
    { key: 'send-to-interact', value: 'Send to interactive display' }
  ];
  const Profile = [{ key: 'profile-settings', value: 'Profile settings' }];
type settingsState={
      board:string,
      prefer:string,
      short: string,
      follow: string,
      interact: string,
      profile: string,
}
type settingsProp={}
class Settings extends React.Component<settingsProp, settingsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      board: "",
      prefer: "",
      short: "",
      follow: "",
      interact: "",
      profile: "",
      };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: any) {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    
      // @ts-ignore
      this.setState({
      [name]: value,
    });
  }
  handleSubmit(e: any) {
    e.preventDefault();
  }

render (){
 return [ (

<>

     <div className="FormCenter">
       <form onSubmit={this.handleSubmit} className="FormFields">
         <div className="FormField">
           <label className="FormField__Label" htmlFor="board">
             Board
           </label>
           <div className="FormField__selectWrapper">
              <select
               id="region"
               className="FormField__select"
               name="board"
               value={this.state.board}
               onChange={this.handleChange}
              >
               {Board.map((r) => (
                 <option key={r.key} value={r.key}>
                   {r.value}
                 </option>
               ))}
              </select>
            </div>
          </div>
          <div className="FormField">
                   <div className="FormField__selectWrapper">
                    <select
                      id="prefer"
                      className="FormField__select"
                      placeholder="Less than 15"
                      name="prefer"
                      value={this.state.prefer}
                      onChange={this.handleChange}
                    >
                      {Prefer.map((k) => (
                        <option key={k.key} value={k.key}>
                        {k.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                  <div className="FormField__selectWrapper">
                  <select
                    id="short"
                    className="FormField__select"
                    placeholder="1GB"
                    name="short"
                    value={this.state.short}
                    onChange={this.handleChange}
                  >
                    {Short.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.value}
                      </option>
                    ))}
                  </select>
                  </div>
                                  
                <div className="FormField">
                  <div className="FormField__selectWrapper">
                  <select
                    id="follow"
                    className="FormField__select"
                    placeholder="Less than 10,000"
                    name="follow"
                    value={this.state.follow}
                    onChange={this.handleChange}
                  >
                    {Follow.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.value}
                      </option>
                    ))}
                  </select>
                  </div>
                </div>
                <div className="FormField">
                  <div className="FormField__selectWrapper">
                  <select
                    id="interact"
                    className="FormField__select"
                    placeholder="1,000,000"
                    name="interact"
                    value={this.state.interact}
                    onChange={this.handleChange}
                  >
                    {Interact.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.value}
                      </option>
                    ))}
                  </select>
                  </div>
                 </div>
                <div className="FormField">
                  <div className="FormField__selectWrapper">
                  <select
                    id="profile"
                    className="FormField__select"
                    placeholder="None"
                    name="profile"
                    value={this.state.profile}
                    onChange={this.handleChange}
                  >
                    {Profile.map((k) => (
                      <option key={k.key} value={k.key}>
                        {k.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
                
              </form>
            </div>
          </>
 )
]
}
}
export default Settings

