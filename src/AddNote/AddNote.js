import React, { Component } from 'react';
import NotefulContext from '../NotefulContext';
import config from '../config';
import ValidationError from '../ValidationError';

export default class AddNote extends Component {
    static contextType = NotefulContext;

    state = {
        appError: null,
        formValid: false,
        errorCount: null,
        name: '',
        folderId: '',
        content: '',
        errors: {
            folderId:
                'You must select a folder',
            name: 'You must enter a note title',
            content: 'You must enter a description'
        },
        noteNameIndicator: false,
        noteContentIndicator: false,
        noteFolderIDIndicator: false
    }

    // updateErrorCount = () => {
    //     let errors = this.state.errors;
    //     let count = 0;

    //     Object.values(errors).forEach(val => {
    //         if (val.length > 0) {
    //             count++;
    //         }
    //     });
    //     this.setState({ errorCount: count });
    //     let valid = count === 0 ? true : false;
    //     this.setState({ formValid: valid });
    // };

    updateFolderId(folderId) {
        this.setState({ folderId: { value: folderId, touched: true } });
    }

    // validateEntry = (name, value) => {
    //     let err = '';
    //     if (name === 'name') {
    //         if (value.length === 0) {
    //             return 'Name is required.'
    //         }
    //         else if (name.length < 3) {
    //             return "Name must be at least 3 characters long";
    //         }
    //     }
    //     const { errors } = { ...this.state };
    //     errors[name] = err;
    //     this.setState({ errors });
    // }

    validateNoteName = (value) =>{
        if (value.trim().length === 0) {
            let newText = 'Note name is required.';
            const newItems = {
                ...this.state.errors,
                name: newText
            }
            this.setState({
                errors : newItems
            });
        } else if (value.length < 3) {
            let newText = "Note name must be at least 3 characters long";
            const newItems = {
                ...this.state.errors,
                name: newText
            }
            this.setState({
                errors : newItems
            });          
        } else if(value.length > 3){
            let newText = "You are fine..";
            const newItems = {
                ...this.state.errors,
                name: newText
            }
            this.setState({
                errors : newItems,
                noteNameIndicator: true
            });
        }
    }


    
    validateNoteContent = (value) =>{
        if (value.trim().length === 0) {
            let newText = 'Note content is required.';
            const newItems = {
                ...this.state.errors,
                noteContentMessage: newText
            }
            this.setState({
                errors : newItems
            });
        } else if (value.length < 10) {
            let newText = "Note content must be 10 characters long";
            const newItems = {
                ...this.state.errors,
                content: newText
            }
            this.setState({
                errors : newItems
            });          
        } else if(value.length > 3){
            let newText = "You are fine..";
            const newItems = {
                ...this.state.errors,
                content: newText
            }
            this.setState({
                errors : newItems,
                noteContentIndicator: true
            });
        }
    }


    validateFolderType = (value) =>{
        if (value === "") {
            let newText = 'You must choose valid folder type';
            const newItems = {
                ...this.state.errors,
                folderId: newText
            }
            this.setState({
                errors : newItems
            }); 
        }else{
            let newText = 'You are fine..';
            const newItems = {
                ...this.state.errors,
                folderId: newText
            }
            this.setState({
                errors : newItems,
                noteFolderIDIndicator: true
            }); 
        } 
    }



    // handleChange = e => {
    //     const { name, value } = e.target;
    //     this.setState(
    //         { [name]: value.trim() },
    //     );
    //     this.validateEntry(name, value.trim());
    //     this.updateErrorCount();
    // }

    handleNoteNameChange = (event) =>{
        this.setState({name: event.target.value});
        this.validateNoteName(event.target.value);
    }

    handleNoteContentChange = (event) =>{
        this.setState({content: event.target.value});
        this.validateNoteContent(event.target.value);
    }

    handleFolderIDChange = (event) =>{
        this.setState({folderId: event.target.value});
        this.validateFolderType(event.target.value);
    }


    
    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.errorCount > 0) return;

        const { name, folderId, content } = e.target;
        const note = {
            note_name: name.value,
            folder_id: folderId.value,
            content: content.value,
            modified: new Date()
        };
        this.setState({ appError: null });

        fetch(config.API_NOTES, {

            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error;
                    });
                }
                return res.json();
            })
            .then(data => {
                name.value = '';
                content.value = '';
                folderId.value = '';
                this.context.addNote(data);
                this.setState({ data });
                this.props.history.push('/', data);
            })
            .catch(error => {
                this.setState({ appError: error });
            });
    };

    render() {
        const { errors } = this.state;
        // const folders = this.context.folders;
        const { folders = [] } = this.context;
        const {noteNameIndicator, noteContentIndicator, noteFolderIDIndicator} = this.state;
        const isEnabled = noteNameIndicator && noteContentIndicator && noteFolderIDIndicator;
        if (this.state.appError) {
            return <p className="error">{this.state.appError}</p>;
        }

        return (
            <form className="add-note" onSubmit={this.handleSubmit}>
                <legend>
                    <h3>Add Note</h3>
                </legend>
                <label htmlFor="name"><h4>Note Name</h4></label>
                <input
                    type="text"
                    className="add-note__name"
                    name="name"
                    id="name"  
                    value={this.state.name}
                    onChange={this.handleNoteNameChange}
                />

                {errors.name.length > 0 && (
                    <ValidationError message={errors.name} />)}
                <label htmlFor="content"><h4>Note Content</h4></label>
                <input
                    type="text"
                    className="add-note__content"
                    name="content"
                    id="content"        
                    value={this.state.content}
                    onChange={this.handleNoteContentChange}
                />
                {errors.content.length > 0 && (
                    <ValidationError message={errors.content} />)}
                <select
                    id="folderId"
                    name="folderId"
                    value={this.state.folderId}
                    onChange={this.handleFolderIDChange}
                >
                    <option value="">Select a folder</option>
                    {folders.map(folder => (<option key={folder.id} value={folder.id}>{folder.folder_name}</option>))}
                </select>
                {errors.folderId.length > 0 && (
                    <ValidationError message={errors.folderId} />)}
                <button
                    type="submit"
                    id="submit-btn"
                    disabled={!isEnabled}>Submit</button>

                {/* {this.state.errorCount !== null ? (
                    <p className="form-status">
                        Form is {this.state.formValid ? 'complete' : 'incomplete'}
                    </p>
                ) : null} */}

            </form>
        );
    }
}