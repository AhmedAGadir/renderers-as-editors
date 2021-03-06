import React from 'react';

import { ToDoAdder, Grid } from './components'
import { ToDo, ToDoList, IAddToDo, IDeleteToDo } from './interfaces/todo';
import * as UTILS from './utils';

import './App.scss';

interface AppState {
	/** Collection of {@link ToDo | toDos} */
	toDoList: ToDoList
}

/** Root level component of the application */
class App extends React.Component<{}, AppState> {

	public state: AppState = {
		toDoList: [
			{ description: 'Go to Japan', deadline: '01/07/2020', id: UTILS.uuid() },
			{ description: 'Climb Mt. Fuji', deadline: '08/07/2020', id: UTILS.uuid() },
			{ description: 'Ride the Bullet Train', deadline: '15/07/2020', id: UTILS.uuid() },
			// { description: 'Drive a real life Mario Kart', deadline: '22/08/2020', id: UTILS.uuid() },
			// { description: 'Go on a ramen tour', deadline: null, id: UTILS.uuid() },
		]
	}

	/** adds a {@link ToDo | toDo} to {@link AppState.toDoList}  */
	private addToDo: IAddToDo = (toDoToAdd: ToDo): void => {
		const toDoList: ToDo[] = this.state.toDoList.map(toDo => ({ ...toDo }));
		toDoList.push(toDoToAdd);
		this.setState({ toDoList });
	}

	/** removes a {@link ToDo | toDo} from {@link AppState.toDoList}  */
	private deleteToDo: IDeleteToDo = (toDoToDelete: ToDo): void => {
		const toDoList: ToDo[] = this.state.toDoList.filter(toDo => toDo.id !== toDoToDelete.id);
		this.setState({ toDoList });
	}

	public render(): React.ReactElement {
		return (
			<div className="app-component">
				<ToDoAdder addToDo={this.addToDo} />
				{/* 
				// @ts-ignore */}
				<Grid toDoList={this.state.toDoList} deleteToDo={this.deleteToDo} />
				<img src={require("./assets/ag-grid-logo.png")} alt="ag-Grid Logo" />
			</div>
		);
	}
}

export default App;