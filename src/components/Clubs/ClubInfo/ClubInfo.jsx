import React from 'react';
import Helmet from 'react-helmet';
import useParams from 'react-router-dom';

function ClubInfo() {
  const params = useParams();
  const { clubData } = this.props;

  console.log(params);

}
