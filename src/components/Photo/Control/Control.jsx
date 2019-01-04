import React from 'react';
import BEM from '../../BEM/BEM';
import PropTypes from 'prop-types';
import FileUploader from 'react-firebase-file-uploader';
import { FormattedMessage } from 'react-intl';
import { firebaseConnect } from 'react-redux-firebase';
import { Button } from 'react-md';
import './Control.css';

/**
 * Control
 */
class Control extends React.Component {
    static propTypes = {
        uploadPhotoHandler: PropTypes.func.isRequired,
        clearPhotoHandler: PropTypes.func,
        maxWidth: PropTypes.number,
        maxHeight: PropTypes.number,
        maxSize: PropTypes.number
    };

    static defaultProps = {
        bem: new BEM('control')
    };

    constructor(props) {
        super(props);

        this.fileInput = React.createRef();
    }

    state = {};

    render() {
        const { bem, mixCls, firebase, maxHeight, maxWidth, maxSize } = this.props,
            { fileName, progress, isUploading, error } = this.state;

        return (
            <div className={bem.cls(mixCls)}>
                <div className={bem.elem('constrols').cls()}>
                    <label className={bem.elem('upload').cls()}>
                        <Button
                            flat
                            primary
                            swapTheming
                            component='span'>
                            <FormattedMessage id='PhotoControl.chooseFile'/>
                        </Button>
                        <FileUploader
                            ref={this.fileInput}
                            hidden
                            accept='image/*'
                            name='avatar'
                            randomizeFilename
                            maxHeight={maxHeight}
                            maxWidth={maxWidth}
                            onChange={this.handleChange}
                            onUploadError={this.handleUploadError}
                            onUploadSuccess={this.handleUploadSuccess}
                            onProgress={this.handleProgress}
                            storageRef={firebase.storage().ref('images')}/>
                    </label>
                    <Button
                        flat
                        secondary
                        swapTheming
                        className={bem.elem('clear').cls()}
                        onClick={this.clearHandler}>
                        <FormattedMessage id='PhotoControl.clear'/>
                    </Button>
                </div>
                {error &&
                    <div className={bem.elem('item').mods('error').cls()}>
                        <FormattedMessage
                            value={{ maxSize }}
                            id={'PhotoControl.error'}/>
                    </div>
                }
                {isUploading &&
                    <div className={bem.elem('item').cls()}>
                        <FormattedMessage
                            values={{ progress }}
                            id='PhotoControl.progress'/>
                    </div>
                }
                {progress >= 100 && !isUploading &&
                    <div className={bem.elem('item').cls()}>
                        <FormattedMessage
                            values={{ filename: fileName }}
                            id='PhotoControl.file'/>
                    </div>
                }
                {(maxHeight || maxWidth || maxSize) && <div className={bem.elem('item').mods('info').cls()}>
                    {maxSize && <FormattedMessage
                        values={{ maxSize }}
                        id='PhotoControl.sizeInfo'/>
                    }
                    {' '}
                    {(maxHeight || maxWidth) && <FormattedMessage
                        values={{ maxHeight, maxWidth }}
                        id='PhotoControl.info'/>}
                </div>}
            </div>
        );
    }

    handleChange = event => {
        const { target: { files } } = event,
            { maxSize } = this.props,
            { name, size } = files[0];
        let error;

        if (maxSize && size/1024 >= maxSize) {
            error = 'sizeError';
        }

        this.setState({
            isUploading: true,
            progress: 0,
            fileName: name,
            error
        },() => !error && this.fileInput.current.startUpload(files[0]));
    };

    handleProgress = progress => {
        this.setState({ progress });
    };

    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };

    handleUploadSuccess = (filename, uploadTask) => {
        const { firebase } = this.props;

        uploadTask.snapshot.ref
            .getDownloadURL()
            .then(downloadURL => {
                firebase
                    .push('images', { filename, downloadURL })
                    .then(({ key }) => this.props.uploadPhotoHandler(key, downloadURL));
                }
            );

        this.setState({ isUploading: false })
    };

    clearHandler = () => {
        this.setState({
            progress: null,
            isUploading: false,
            error: null
        }, this.props.clearPhotoHandler);
    };
}

export default firebaseConnect()(Control);
