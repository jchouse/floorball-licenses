import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Autocomplete, DialogContainer } from 'react-md';

class PageModal {
    render() {
        const { visibility, content} = this.props;

        return (
            <DialogContainer
                key='choose-user-modal'
                visible={visibility}
                onHide={this.hideHandler}
                actions={this.renderChooseUserModalActions()}
                title='Choose User'
                contentClassName={bem.elem('dialog-content').cls()}
                id='choose-user'>
                content
            </DialogContainer>
        );
    }
}

function mapStateToProps(state) {
    const { modal: { visibility, content } } = state;

    return {
        visibility,
        content
    };
}

exp[ort default compose(connect(mapStateToProps))(PageModal);
