import React from 'react'
import { AppExtensionSDK } from '@contentful/app-sdk'
import {
  Heading,
  Form,
  Workbench,
  Paragraph,
  TextField,
} from '@contentful/forma-36-react-components'
import { css } from 'emotion';
import logo from '../assets/logo.png'

export interface AppInstallationParameters {
  apiKey: string
}

interface ConfigProps {
  sdk?: AppExtensionSDK
}

const Config = ({ sdk }: ConfigProps) => {
  const [parameters, setParameters] = React.useState<AppInstallationParameters>(
    { apiKey: '' }
  )

  const onConfigure = React.useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk?.app.getCurrentState()

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    }
  }, [parameters, sdk])

  React.useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk?.app.onConfigure(() => onConfigure())
  }, [sdk, onConfigure])

  React.useEffect(() => {
    ;(async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        (await sdk?.app.getParameters()) || null

      if (currentParameters) {
        setParameters(currentParameters)
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk?.app.setReady()
    })()
  }, [sdk])

  function updateApiKey(event: React.ChangeEvent<HTMLInputElement>) {
    setParameters((prevParams) => ({
      ...prevParams,
      apiKey: event.target.value.trim(),
    }))
  }

  return (
    <Workbench className='giphyConfig'>
      <Form className='giphyForm'>
        <div>
          <Heading>Connect GIPHY</Heading>
          <Paragraph className={css({ marginBottom: '20px', marginTop: '20px' })}>Enter your API Key for the GIPHY API.</Paragraph>
          <TextField
            id="apiKey"
            name="apiKey"
            labelText="GIPHY API Key:"
            textInputProps={{ width: 'large' }}
            value={parameters.apiKey}
            onChange={updateApiKey}
          />
          </div>
          <img className='configGif' src="https://media.giphy.com/media/hmVVRM1uV7vYA/giphy.gif?cid=ecf05e47rxig1yga9p64g7zkey7so6ecwi9sb72skv8ajtwn&rid=giphy.gif&ct=g" alt="Tina Fey giving herself a high five" />
          <div className='giphyCredit'>
            <Paragraph className='giphyAttribution'>Powered by</Paragraph>
            <img className='giphyLogo' src={logo} alt="GIPHY logo" />
          </div>
      </Form>
    </Workbench>
  )
}

export default Config 
