import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import logo from './assets/logo.png'
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import * as SplashScreen from 'expo-splash-screen';


export default function App() {

  const [selectedImage, setSelectedImage] = React.useState(null);


  let openImagePicker = async () =>{
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
     
    //Recordar eliminar estas lineas despues de probar splasg
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 5000);

    if (permissionResult.granted === false){
      alert('Permission to access camera roll is requiered');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled == true){
      return;
    }

    if(Platform.OS === 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({localUri: pickerResult.uri, remoteUri});
    }else{
      setSelectedImage({localUri: pickerResult.uri, remoteUri: null});

    }

    
  };

  let openShareDialogAsync = async ()=>{
    if (!( await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null ){
    return  (
      <View style={styles.container}>
        <Image source={{uri: selectedImage.localUri}} style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>

          <Text style={styles.buttonText}>
            Share this Photo
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!!</Text>
     <TouchableOpacity onPress={openImagePicker} style={styles.button}>
       <Text style={styles.buttonText}>
         Pick a Photo
       </Text>
     </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305, height: 159
  },
  instructions: {
    color: '#888', fontSize: 18
  },
  button:{
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText:{
    fontSize: 20, 
    color: '#fff'
  },
  thumbnail:{
    width: 300,
    height: 300,
    resizeMode:'contain',
  },
});
