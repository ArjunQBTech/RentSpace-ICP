import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {COLORS, SIZES} from '../../../constants/themes';
import { Dialog,ALERT_TYPE } from 'react-native-alert-notification';

const SaveBtn = ({setHostModal}) => {


  return (
    <View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          // setHostModal(0)
          // alert('Please complete your listing first!');
          Dialog.show({
            type:ALERT_TYPE.WARNING,
            title:'WARNING',
            textBody:'Please Complete Your Listing First!',
            button:'OK',
          })
          
        }}>
        <Text style={styles.btnText}>Save & exit</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default SaveBtn;

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginLeft: '7.5%',
    borderColor: COLORS.black,
    borderWidth: 1.2,
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal:14
  },
  btnText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: SIZES.preMedium,
  },
});
