import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ForecastItem } from '.'
import dayjs from 'dayjs'

const ForcastItem = ({forcast}:{forcast:ForecastItem}) => {
  return (
    <View className='bg-gray-100 p-3 aspect-[9/16] rounded-xl justify-center items-center'>
  <Text className='font-sans text-2xl text-gray-700'>{Math.round(forcast.main.temp)}°</Text> 
  <Text className='font-bold text-xs '> {dayjs(forcast.dt*1000).format(`ddd ha`)}</Text>
  </View>
  )
}

export default ForcastItem

const styles = StyleSheet.create({})