import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.css';

registerPlugin(FilePondPluginFileValidateType);


class FileUpload extends Component {

    constructor(props) {
        super(props);

        this.process = this.process.bind(this);
    }

    process(fieldName, file, metadata, load, error, progress, abort) {
        // fieldName is the name of the input field
        // file is the actual file object to send
        const formData = new FormData();
        formData.append(fieldName, file, file.name);

        const request = new XMLHttpRequest();
        request.open('POST', this.props.server);

        // Should call the progress method to update the progress to 100% before calling load
        // Setting computable to false switches the loading indicator to infinite mode
        request.upload.onprogress = (e) => {
            progress(true, e.loaded, e.total * 2);
        };

        let lastPos = 0;
        let loaded = 0.5;
        request.onreadystatechange = function() {
            console.log('.');
            if (request.readyState === 3) {
                let data = request.responseText.substring(lastPos);
                lastPos = request.responseText.length;
                let updateLoaded = Number(Number('0.' + data.split('.')[1]).toFixed(2));
                if (updateLoaded > loaded && updateLoaded <= 1) {
                    loaded = updateLoaded;
                    progress(true, loaded, 1);
                }
            }
        };

        // Should call the load method when done and pass the returned server file id
        // this server file id is then used later on when reverting or restoring a file
        // so your server knows which file to return without exposing that info to the client
        request.onload = function() {
            if (request.status >= 200 && request.status < 300) {
                // the load method accepts either a string (id) or an object
                load(request.responseText.substring(lastPos));
            }
            else {
                // Can call the error method if something is wrong, should exit after
                error('oh no');
            }
        };

        request.send(formData);

        // Should expose an abort method so the request can be cancelled
        return {
            abort: () => {
                // This function is entered if the user has tapped the cancel button
                request.abort();
                // Let FilePond know the request has been cancelled
                abort();
            }
        };
    }

    render() {
        return (
            <div>
                <FilePond
                    server={
                        {
                            url:     this.props.server,
                            process: this.process,
                            revert:  false,
                            restore: false,
                            load:    false,
                            fetch:   false
                        }
                    }
                    allowRevert={false}
                    allowReplace={false}
                    acceptedFileTypes={['text/csv']}
                />
            </div>
        );
    };
}

export default FileUpload;