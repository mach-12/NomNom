import { View, Text, Dimensions,Image } from 'react-native'
import React from 'react'

const {width,height}=Dimensions.get('screen')

export default function OnboardingItem({item}) {

  return (
    <View style={{flex: 1,justifyContent: 'center', alignItems: 'center', width: width}}>
      <Image source={item.image} style={{width: width, resizeMode: 'contain', flex: 0.7, justifyContent: 'center'}}/>
      <View style={{flex: 0.3, alignItems: 'center'}}>
        <Text style={{fontWeight: '500', fontSize: 28, marginBottom: 10, color: 'black', textAlign: 'center', paddingHorizontal: 64}}>{item.title}</Text>
        <Text style={{fontWeight: '300', color: '#62656b', textAlign: 'center', paddingHorizontal: 64}}>{item.description}</Text>
      </View>
    </View>
  )
}