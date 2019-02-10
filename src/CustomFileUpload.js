import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";


class CustomFileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = { file: null, progress: 0 };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.sendProgress = this.sendProgress.bind(this);
    }

    sendProgress (progress) {
        this.setState({ progress });
    }

    fileUpload(file) {
        return new Promise((resolve, reject) => {
            // fieldName is the name of the input field
            // file is the actual file object to send
            const formData = new FormData();
            formData.append('csvFile', file);

            const request = new XMLHttpRequest();
            request.open('POST', this.props.server);

            // Should call the progress method to update the progress to 100% before calling load
            // Setting computable to false switches the loading indicator to infinite mode
            request.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    let progress = e.loaded / (e.total * 3);
                    this.sendProgress(progress);
                }
            };
            let lastPos = 0;
            request.onreadystatechange = () => {
                if (request.readyState === 3) {
                    let data = request.responseText.substring(lastPos);
                    lastPos = request.responseText.length;
                    let progress = Number(Number('0.' + data.split('.')[1]).toFixed(2));
                    if (progress > this.state.progress && progress <= 1) {
                        this.sendProgress(progress);
                    }
                }
            };
            // Should call the load method when done and pass the returned server file id
            // this server file id is then used later on when reverting or restoring a file
            // so your server knows which file to return without exposing that info to the client
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    // the load method accepts either a string (id) or an object
                    this.sendProgress(1);
                    resolve(request.responseText.substring(lastPos));
                } else {
                    // Can call the error method if something is wrong, should exit after
                    reject('Oh no, something went wrong: ');
                }
            };
            request.send(formData);
        });
    }

    onChange(e) {
        this.setState({ file:e.target.files[0] });
    }

    onSubmit(e) {
        e.preventDefault(); // Stop form submit
        this.fileUpload(this.state.file).then(() => {
            console.log('file uploaded');
        });
        return false;
    }

    render() {

        if (this.state.progress >= 1) {
            return '';
        }

        return (
            <div id="fileUpload" className="py2">
                <form method="post" action={this.props.server} onSubmit={this.onSubmit} className="pb1">
                    <input type="file" id="uploadField" className="field" name="csvFile" onChange={this.onChange}/>
                    <button type="submit" className="btn btn-primary" id="uploadButton" disabled={!this.state.file}>Upload</button>
                </form>
                <Progress percent={(this.state.progress * 100).toFixed(0)} status="active" />
            </div>
        );
    };
}

export default CustomFileUpload;