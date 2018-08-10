import React from 'react';
import BEM from '../../BEM/BEM';
import PropTypes from 'prop-types';
import FileUploader from 'react-firebase-file-uploader';
import { firebaseConnect } from 'react-redux-firebase';

/**
 * Control
 */
class Control extends React.Component {
    static propTypes = {
        uploadPhotoHandler: PropTypes.func.isRequired
    };

    static defaultProps = {
        bem: new BEM('control')
    };

    state = {};

    render() {
        const { bem, mixCls, firebase } = this.props;

        return (
            <div className={bem.cls(mixCls)}>
                <div className={bem.elem('upload').cls()}>
                    <FileUploader
                        accept='image/*'
                        name='avatar'
                        randomizeFilename
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                        storageRef={firebase.storage().ref('images')}/>
                </div>
            </div>
        );
    }

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

    handleProgress = progress => this.setState({progress});

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
    }
}

export default firebaseConnect()(Control);
