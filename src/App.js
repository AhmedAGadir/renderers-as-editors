import React, { Component } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import 'normalize.css';

import './App.scss'


// import { useState, forwardRef, useImperativeHandle } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { format, differenceInDays } from 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';




// tooltip for the dates saying you have X days remaining 



class DateRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null
    }
  }

  componentDidMount = () => {
    if (!this.props.value) {
      return;
    }
    const [_, day, month, year] = this.props.value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    let selectedDate = new Date(year, month - 1, day);
    this.setState({ selectedDate });
  }

  handleDateChange = d => {
    if (d) {
      d.setHours(0, 0, 0, 0);
    }
    this.setState({
      selectedDate: d
    }, () => {
      this.props.node.setDataValue('date', format(this.state.selectedDate, 'dd/MM/yyyy'));
    });
  }

  refresh(params) {
    debugger;
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id={`date-picker-dialog-${this.props.node.id}`}
          format="dd/MM/yyyy"
          value={this.state.selectedDate}
          onChange={this.handleDateChange}
          // variant="inline"
          disableToolbar
          placeholder={'Date Due'}
        // style={{
        //   color: new Date() > this.state.selectedDate ? 'limegreen' : 'red',
        // }}

        />
      </MuiPickersUtilsProvider>
    )
  }
}
// })



class ToDoRenderer extends Component {
  constructor(props) {
    // console.log('[ToDoRenderer] Constructor')
    super(props);
    this.state = {
      editing: false,
      editingVal: null
    };
    this.taskInputRef = React.createRef()
  }

  componentDidMount = () => {
    this.setState({
      editingVal: this.props.value
    })
  }

  // refresh = () => {
  //   console.log('refresh');
  //   return true;
  // }

  destroy = () => {

  }

  toggleEdit = () => {
    if (this.props.getCurrentlyEditingId() !== null) {
      alert('You are already editing a row!');
      return;
    }
    this.setState(prevState => ({
      editing: !prevState.editing
    }), () => {
      this.props.letGridKnow(this.state.editing ? this.props.data.id : null);
      if (this.state.editing) {
        this.taskInputRef.current.focus();


        // this.taskInputRef.current.setSelectionRange(2, 7)

        // this.taskInputRef.current.selectionStart = this.taskInputRef.current.value.length;
        // this.taskInputRef.current.selectionEnd = this.taskInputRef.current.value.length;
        // this.taskInputRef.current.select();
      }
    });
  }

  // finishEdit = (bool) => {
  //   if (bool) {
  //     this.props.node.setDataValue(this.props.column.colId, this.state.editingVal);
  //   }
  //   this.setState({ editing: false, editingVal: this.props.value })
  //   this.props.letGridKnow(null)
  // }

  render() {
    let component = null;

    {/* <button onClick={() => this.finishEdit(true)}>Save</button>
          <button onClick={() => this.finishEdit(false)}>Cancel</button> */}

    if (this.state.editing) {
      component = (
        <input
          ref={this.taskInputRef}
          value={this.state.editingVal}
          onChange={e => this.setState({ editingVal: e.target.value })}
          style={{
            width: '100%',
            height: 35,
            color: 'slategrey',
            background: 'whitesmoke'
          }} />
      )
    } else {
      component = <div
        style={{
          // textDecoration: this.props.data.completed ? 'line-through' : 'none',
          // color: this.props.data.completed ? 'darkgrey' : 'black'
        }}
      >
        <span className={this.props.data.completed ? "strike" : ''}>{this.props.value}</span></div>
    }

    return (
      <div onDoubleClick={this.toggleEdit} className="todowrapper">
        {component}
      </div>
    );
  }
}

class CompletedRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: null
    }
  }

  componentDidMount = () => {
    this.setState({ completed: this.props.value })
  }

  setCompleted = bool => {
    this.setState({ completed: bool }, () => {
      this.props.node.setDataValue(this.props.column.colId, bool);
      // this.props.api.redrawRows({ rowNodes: [this.props.node], force: true });
      this.props.api.refreshCells({ rowNodes: [this.props.node], force: true });
    })
  }

  deleteToDo = () => {
    if (window.confirm('Are you sure youd like to delete this row?')) {
      this.props.deleteToDo(this.props.node.id)
    }
  }

  render() {
    let component;
    if (this.state.completed) {
      component = <span className="completed-icon" onClick={() => this.setCompleted(false)}>✔</span>
    } else {
      component = <span className="uncompleted-icon" onClick={() => this.setCompleted(true)}>✔</span>
    }

    return (
      <>
        {component}
      </>
    )
  }
}


class DeleteRenderer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
  }

  deleteToDo = () => {
    if (window.confirm('Are you sure youd like to delete this row?')) {
      this.props.deleteToDo(this.props.node.id)
    }
  }

  render() {
    return (
      <span className="delete-icon" onClick={this.deleteToDo}>⨉</span>
    )
  }
}


// class DateTooltip extends Component {
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount = () => {
//   }

//   deleteToDo = () => {
//     if (window.confirm('Are you sure youd like to delete this row?')) {
//       this.props.deleteToDo(this.props.node.id)
//     }
//   }

//   render() {
//     return (
//       <span>{JSON.stringify(this.props.value)}</span>
//     )
//   }
// }


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      idSeq: 1,
      columnDefs: [
        {
          headerName: 'Description',
          field: 'description',
          rowDrag: true,
          suppressMenu: true,
          flex: 3,
          cellRenderer: 'toDoRenderer',
          cellRendererParams: {
            letGridKnow: id => {
              this.setState({ currentlyEditingId: id }, () => { console.log('this.state.currentlyEditingId', this.state.currentlyEditingId) })
            },
            getCurrentlyEditingId: () => {
              return this.state.currentlyEditingId
            }
          }
        },
        {
          headerName: 'Date Due',
          field: 'date',
          // hide: true,
          suppressMenu: true,
          width: 180,
          cellRenderer: 'dateRenderer',
          tooltipValueGetter: this.tooltipValueGetter
        },
        {
          headerName: 'Completed',
          field: 'completed',
          suppressMenu: true,
          width: 60,
          cellRenderer: 'completedRenderer',
        },
        {
          headerName: 'Delete',
          cellRenderer: 'deleteRenderer',
          hide: true,
          width: 45,
          cellRendererParams: {
            deleteToDo: id => this.deleteToDo(id)
          }
        }
      ],
      rowData: [
        { description: 'Give Ahmed a raise (300k)', id: 0, date: '11/07/2020', completed: false },
        { description: 'Move the team to Barcelona', id: 987, date: '19/11/2020', completed: false },
        { description: 'Buy the team lunch', id: 999, date: '23/04/2020', completed: true },
        // { description: 'Goodbye Latin America Hello!', id: 599, date: '01/08/2020', completed: false },
        // { description: 'Buy Coca-Cola', id: 666, date: '12/03/2020', completed: true },
      ],
      frameworkComponents: {
        toDoRenderer: ToDoRenderer,
        dateRenderer: DateRenderer,
        completedRenderer: CompletedRenderer,
        deleteRenderer: DeleteRenderer,
      },
      currentlyEditingId: null,
    }
    this.inputRef = React.createRef();
  }

  componentDidMount = () => {
    this.inputRef.current.focus();
  }


  tooltipValueGetter = params => {
    if (!params.value) {
      return;
    }
    const [_, day, month, year] = params.value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    let dateValue = new Date(year, month - 1, day);

    let difference = differenceInDays(dateValue, new Date());
    // let color = difference > 0 ? 'limegreen' : 'red';
    return `${difference} days remaining`;
  }

  addToDo = () => {
    if (!this.state.inputVal) {
      return;
    }
    let rowData = this.state.rowData.map(row => ({ ...row }));
    rowData.push({
      description: this.state.inputVal,
      id: this.state.idSeq,
      date: null,
      completed: false
    });
    this.setState(prevState => ({
      rowData,
      inputVal: '',
      idSeq: prevState.idSeq + 1
    }), () => {
    });
  }

  deleteToDo = id => {
    let rowData = this.state.rowData.filter(row => row.id !== id);
    this.setState({ rowData });
  }

  render() {
    return (
      <div style={{ width: 600, position: 'absolute', left: '50%', top: '30vh', transform: 'translateX(-50%)' }}>
        {/* <h1 style={{ color: 'white', fontSize: 50, fontFamily: 'Roboto', fontWeight: 400, textAlign: 'center' }}>To-Do List</h1> */}
        <form style={{ display: 'flex' }} onSubmit={e => e.preventDefault()}>
          <input
            ref={this.inputRef}
            className="to-do-input"
            value={this.state.inputVal}
            onChange={e => this.setState({ inputVal: e.target.value })}
            placeholder="Enter Task..." />
          <button type="submit"
            onClick={this.addToDo}>+</button>
        </form>
        <div
          className="ag-theme-alpine"
          style={{
            height: '100%',
            boxShadow: ''
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            frameworkComponents={this.state.frameworkComponents}
            immutableData
            getRowNodeId={data => {
              return data.id
            }}
            domLayout="autoHeight"
            headerHeight={0}
            rowHeight={65}
            getRowStyle={params => {
              if (params.node.data.completed) {
                return { background: 'lightgreen' }
              } else {
                return { background: 'none' }
              }
            }}
            rowDragManaged
            animateRows
            // sideBar={{
            //   toolPanels: [{
            //     id: 'columns',
            //     labelDefault: '',
            //     labelKey: 'columns',
            //     iconKey: 'columns',
            //     toolPanel: 'agColumnsToolPanel',
            //     toolPanelParams: {
            //       suppressRowGroups: true,
            //       suppressValues: true,
            //       suppressPivotMode: true,
            //       suppressColumnFilter: true
            //     }
            //   }]
            // }}
            popupParent={document.body}
          >
          </AgGridReact>
        </div>
        <img src={require("./ag-grid-logo.png")} style={{ width: 200, margin: '40px auto 0', display: 'block' }} />
      </div>
    );
  }
}

export default App;