import React, { useEffect, useState } from 'react';
import { FormLabel, TextInput, Button, IconButton } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { AppInstallationParameters } from './ConfigScreen'
interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {

  const params = props.sdk.parameters.installation as AppInstallationParameters
  const [searchTerm, setSearchTerm] = useState("");
  const [gif, setGif] = useState("");

  const searchGif = () => {
    if (searchTerm.length > 0) {
      fetch(`https://api.giphy.com/v1/gifs/search?api_key=${params.apiKey}&limit=1&offset=0&q=${searchTerm}`)
        .then((result) => {
          return result.json();
        })
        .then((result) => {
          setGif(result.data.map((gif: { images: { fixed_height: { url: any; }; }; }) => {
            const gifURL = gif.images.fixed_height.url;
            props.sdk.field.setValue(gifURL)
            return gifURL;
          }))
        })
        .catch(() => {
          console.log("Oops, we could not find any results.");
        })
    }
  }

  const deleteGif = () => {
    props.sdk.field.setValue("")
    setGif("");
  }

  useEffect(() => {
    props.sdk.window.startAutoResizer();
    setGif(props.sdk.field.getValue());
  }, [props.sdk.window, props.sdk.field]);
  return (
    <>
      <div className="gifSearch">
        <FormLabel htmlFor="Giphy Search">Search for a Gif</FormLabel>
        <div className="gifSearchInput">
          <TextInput
            className="gifSearchBox"
            labelText="Search for a Gif"
            name="Giphy Search"
            width="medium"
            id="giphySearch"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value) }}
          />
          <Button buttonType="primary" onClick={searchGif}>Search</Button>
        </div>
      </div>
      {gif &&
      <div className="gifResult">
        <div className="gifImage">
          <img src={gif} alt="Gif"/>
          <IconButton
            className="gifDeleteButton"
            testId="cf-ui-button-actions"
            buttonType="negative"
            label="Entry actions"
            iconProps={{ icon: 'Close', size: 'large' }}
            onClick={deleteGif}
          />
        </div>
      </div>
     }
      <FormLabel htmlFor="Giphy URL">Gif URL (read only)</FormLabel>
      <TextInput
        labelText="GiphyURL"
        name="Giphy URL"
        id="giphyURL"
        disabled
        value={gif}
      />
    </>
  );
};

export default Field;