import React, { useState, useCallback } from 'react';
import {v4 as uuidv4} from 'uuid';
import { useTranslation } from 'react-i18next';

import { ref as storageRef, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref, update, push, child } from "firebase/database";
import { firebaseApp } from '../../firebaseInit';
import { db_paths } from '../../db/db_constans';

import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export interface IImage {
  name: string;
  downloadURL: string;
};

const storage = getStorage(firebaseApp);
const database = getDatabase(firebaseApp);

const StyledFileUploader = styled('div')({
  width: '100%',
});

const StyledFileName = styled('div')({
  width: '100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: '0.8rem',
});

const StyledErorr = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
}));

const Styledlabel = styled('label')({
  display: 'flex',
  alignItems: 'center',
});

interface IFileUploaderProps {
  sizeLimitMB?: number;
  onUploaded: (imageId: string, downloadURL: string) => void;
}

export default function FileUploader(props: IFileUploaderProps) {
  const { onUploaded, sizeLimitMB } = props;
  const { t } = useTranslation();
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const changeFileHandler = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);

      if (sizeLimitMB && file.size > sizeLimitMB * 1024 * 1024) {
        setError(t('FileUploader.error.sizeLimitExceeded', { size: sizeLimitMB }));

        return;
      }

      setLoading(true);

      const fileType = file.type.split('/')[1];
      const myuuid = uuidv4();
      const fileName = `${myuuid}.${fileType}`;

      const fileImagesRef = storageRef(storage, `test/${fileName}`);

      const uploadTask = await uploadBytes(fileImagesRef, file);

      const downloadURL = await getDownloadURL(uploadTask.ref);

      const newImageKey = push(child(ref(database), db_paths.Images)).key;
      const updates: Partial<Record<string, IImage>> = {};
      
      updates[`/${db_paths.Images}/` + newImageKey] = {
        name: fileName,
        downloadURL,
      };

      update(ref(database), updates)
        .then(() => {
          setLoading(false);
          onUploaded(newImageKey ? newImageKey : '', downloadURL);
        })
        .catch((error) => {
          console.log('Error updating database: ', error);
        });
    }

  }, [onUploaded, sizeLimitMB, t]);

  return (
    <StyledFileUploader>
      <Styledlabel htmlFor='raised-button-file'>
        <input
          accept='image/*'
          style={{ display: 'none' }}
          id='raised-button-file'
          type='file'
          onChange={changeFileHandler}
        />
        <Button variant='contained' component='span' disableElevation>
          Upload
        </Button>
        {loading && <CircularProgress size={24}/>}
      </Styledlabel>
      <StyledFileName>
        {fileName}
      </StyledFileName>
      {error && <StyledErorr>{error}</StyledErorr>}
    </StyledFileUploader>
  );
}