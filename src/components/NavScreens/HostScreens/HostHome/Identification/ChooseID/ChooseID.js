import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BottomBotton from '../reusables/BottomBotton';
import Heading from '../reusables/Heading';
import {COLORS, SIZES} from '../../../../../../constants/themes';
import OptionCard from './OptionCard';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Entypo';
import UploadModal from '../../../UpdatePage/Popups/UploadModal';

import {launchImageLibrary} from 'react-native-image-picker';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {storage} from '../../../../../../../firebaseConfig';
import {downloadFile} from 'react-native-fs';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../../../../redux/users/actions';

const ChooseID = ({setIdprocess, pos}) => {
  const IDoptions = [
    {
      title: "Driver's license",
      tag: 'dl',
    },
    {
      title: 'Passport',
      tag: 'passport',
    },
    {
      title: 'Identity card',
      tag: 'ID',
    },
  ];
  const countries = [
    {label: 'India', value: 'India'},
    {label: 'U.S.', value: 'U.S.'},
    {label: 'Turkey', value: 'Turkey'},
    {label: 'Britain', value: 'Britain'},
    {label: 'Japan', value: 'Japan'},
  ];
  const [country, setCountry] = useState('');
  const [IDOption, setIDOption] = useState(IDoptions[2].tag);
  const [IDTitle, setIDTitle] = useState(IDoptions[2].title);
  const [uploadedDoc, setUploadedDoc] = useState({
    idNumber: '',
    doc: '',
  });

  const [upload, setUpload] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const {user} = useSelector(state => state.userReducer);
  const {actors} = useSelector(state => state.actorReducer);
  const dispatch = useDispatch();

  const selectImage = async () => {
    console.log('Select Image');
    await launchImageLibrary(
      {mediaType: 'photo', includeBase64: true},
      response => {
        if (response && !response.didCancel) {
          console.log('Response', response.assets[0].uri);
          // setUpload(true);
          // uploadImage(response.assets[0].uri);
          setUploadedDoc({...uploadedDoc, doc: response.assets[0].uri});
        } else {
          console.log('No Image Selected');
        }
      },
    );
  };

  const uploadImage = async uri => {
    console.log('Upload Image : ', uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, 'hotelImage/' + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setTransferred(progress.toFixed());
      },
      error => {
        console.log('Error Uploading Image', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          try {
            console.log('File available at', downloadURL);
            setUploadedDoc({...uploadedDoc, doc: downloadURL});
            console.log('doc uploaded updating user : ', {
              ...user,
              govIDLink: downloadURL,
              userGovID: uploadedDoc.idNumber,
            });
            let userRes = await actors?.userActor?.updateUserDetails({
              ...user,
              govIDLink: downloadURL,
              userGovID: uploadedDoc.idNumber,
            });
            if (userRes?.err != undefined) {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error ',
                textBody:
                  'Something went wrong while uploading, please try again',
                button: 'OK',
              });
              setUpload(false);

              return;
            }
            console.log(userRes?.ok);
            setUpload(false);
            setIdprocess(0);
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Document Uploaded Successfully',
              textBody: 'Your Document has been uploaded successfully',
              button: 'OK',
            });

            dispatch(
              setUser({
                ...user,
                govIDLink: downloadURL,
                userGovID: uploadedDoc.idNumber,
              }),
            );
          } catch (err) {
            console.log(err);
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Error ',
              textBody:
                'Something went wrong while uploading, please try again',
              button: 'OK',
            });
            setUpload(false);
          }
        });
      },
    );
  };

  const submitDoc = () => {
    const finalData = {
      idNumber: uploadedDoc.idNumber,
      doc: uploadedDoc.doc,
      country: country,
      IDOption: IDOption,
    };

    // console.log('Final Data : ', finalData);

    if (
      finalData.idNumber === '' ||
      finalData.idNumber == undefined ||
      finalData.doc === '' ||
      finalData.doc == undefined ||
      finalData.country === '' ||
      finalData.country == undefined ||
      finalData.IDOption === '' ||
      finalData.IDOption == undefined
    ) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Please Fill All the Fields',
        textBody: 'No Field Should be Empty',
        button: 'OK',
      });
    } else {
      setUpload(true);
      uploadImage(uploadedDoc.doc);
    }
  };

  return (
    <View style={styles.view}>
      <Heading text={'identity verification'} setIdprocess={setIdprocess} />

      <ScrollView
        style={{width: '100%', height: '100%'}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose an ID type to add</Text>
        {/* <Dropdown
          style={styles.dropdown}
          data={countries}
          selectedTextStyle={styles.dropText}
          itemTextStyle={styles.dropText}
          labelField="label"
          valueField="value"
          containerStyle={{borderRadius: 12}}
          placeholderStyle={styles.dropText}
          value={country}
          onChange={value => setCountry(value)}
          iconStyle={{height: 30, width: 30}}
        /> */}

        <TextInput
          placeholder={'Country'}
          placeholderTextColor={COLORS.textLightGrey}
          style={[styles.uploadContainer, {marginTop: 25}]}
          value={country}
          onChangeText={text => setCountry(text)}
        />

        <OptionCard
          item={IDoptions[0]}
          IDOption={IDOption}
          setIDOption={setIDOption}
          setIDTitle={setIDTitle}
        />
        <View style={styles.line} />
        <OptionCard
          item={IDoptions[1]}
          IDOption={IDOption}
          setIDOption={setIDOption}
          setIDTitle={setIDTitle}
        />

        <View style={styles.line} />
        <OptionCard
          item={IDoptions[2]}
          IDOption={IDOption}
          setIDOption={setIDOption}
          setIDTitle={setIDTitle}
        />

        <TextInput
          placeholder={`Enter your ${IDTitle} number`}
          placeholderTextColor={COLORS.textLightGrey}
          style={[styles.uploadContainer, {marginTop: 25}]}
          value={uploadedDoc.idNumber}
          onChangeText={text =>
            setUploadedDoc({...uploadedDoc, idNumber: text})
          }
        />

        {uploadedDoc.doc ? (
          <Image source={{uri: uploadedDoc.doc}} style={styles.uploadedDoc} />
        ) : (
          <>
            <View style={styles.uploadContainer}>
              <Text style={{color: COLORS.textLightGrey, fontSize: 12}}>
                No File Choosen
              </Text>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => selectImage()}>
                <Icon
                  name="upload"
                  size={20}
                  color={COLORS.white}
                  style={{marginRight: 10}}
                />
                <Text style={{color: COLORS.white, fontSize: 12}}>Upload</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.smallText}>
              Your ID will be handled according to our Privacy Policy and won't
              be shared with your Host or guests.
            </Text>
          </>
        )}
      </ScrollView>

      <BottomBotton
        title={'Add an ID'}
        onClick={() => {
          submitDoc();
          // setIdprocess(0);
        }}
      />

      <Modal visible={upload} transparent>
        <UploadModal transferred={transferred} />
      </Modal>
    </View>
  );
};

export default ChooseID;

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: COLORS.mainGrey,
    width: '100%',
    height: '100%',
  },
  title: {
    color: 'black',
    fontSize: SIZES.medxLarge - 1,
    fontWeight: '500',
    marginTop: 0,
    width: '88%',
    marginLeft: '7.5%',
  },
  smallText: {
    fontSize: SIZES.small - 2,
    color: COLORS.black,
    fontWeight: '300',
    marginLeft: '10%',
    width: '80%',
    marginVertical: 25,
  },
  line: {
    width: '80%',
    marginLeft: '10%',
    height: 1,
    backgroundColor: COLORS.black,
    opacity: 0.5,
    marginVertical: 15,
  },
  dropdown: {
    width: '85%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginLeft: '7.5%',
    marginVertical: 30,
    height: 50,
  },
  dropText: {
    color: COLORS.black,
    fontSize: SIZES.preMedium,
    marginLeft: 20,
  },

  uploadContainer: {
    width: '85%',
    height: 40,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
    marginBottom: 10,
    marginLeft: '7.5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  uploadBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: -5,
  },

  uploadedDoc: {
    width: '85%',
    height: 200,
    borderRadius: 10,
    marginVertical: 25,
    marginLeft: '7.5%',
    marginBottom: 120,
  },
});
