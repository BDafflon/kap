import { useState } from 'react'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined'
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined'
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import Stack from '@mui/material/Stack'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

// project imports

const dataEx = [
  {
    name: '1/02',
    TP: 10,
    Eval: 6,
    Auto: 13
  },
  {
    name: '7/02',
    TP: 12,
    Eval: 10,
    Auto: 15
  },
  {
    name: '14/02',
    TP: 15,
    Eval: 10,
    Auto: 16
  },
  {
    name: '21/02',
    TP: 10,
    Eval: 12,
    Auto: 13
  },
  {
    name: '02/03',
    TP: 12,
    Eval: 12,
    Auto: 14
  },
  {
    name: '10/03',
    TP: 13,
    Eval: 11,
    Auto: 10
  }
]

function GetCard ({ data }) {
  //console.log('card ', data)
  if (data.type == 'text') {
    if (data.size == 'l') {
      return (
        <Box sx={{   p: 2.25, boxShadow: 1 }}>
          <Typography>{data.titre}</Typography>
          <Typography>{data.label}</Typography>
          </Box>
      )
  }
}
  if (data.type == 'rappel') {
    
    return (
      <Box sx={{ height: 85, p: 2.25, boxShadow: 1 }}>
        <Stack direction='row' spacing={2}>
          <Avatar>
            <CalendarTodayIcon />
          </Avatar>

          <Typography variant='button' sx={{ display: 'inline' }} gutterBottom>
            {data.label} <br /> {data.data}
          </Typography>
        </Stack>
      </Box>
    )
  }
  if (data.type === 'graph') {
    if (data.size == 'm') {
      return (
        <Box sx={{ height: 200, p: 2.25, boxShadow: 1 }}>
          <Typography variant='button' display='block' gutterBottom>
            {data.label}
          </Typography>

          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data.data}
              margin={{
                top: 10,

                left: 100,
                bottom: 0
              }}
            >
              <Line
                type='monotone'
                dataKey='data'
                stroke='#8884d8'
                strokeWidth={5}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )
    } else {
      if (data.size == 'l') {
        return (
            <Box sx={{ height: 500, p: 2.25, boxShadow: 1 }}>
          <ResponsiveContainer  height='100%'>
            <LineChart
               
               height={600}
              data={dataEx}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='TP'
                stroke='#8884d8'
                activeDot={{ r: 8 }}
              />
              <Line type='monotone' dataKey='Eval' stroke='#82ca9d' />
              <Line type='monotone' dataKey='Auto' stroke='#833a9d' />
            </LineChart>
          </ResponsiveContainer>
          </Box>
        )
      }
    }
  }
  if (data.type === 'l') {
    return (
      <Box sx={{ height: 600, p: 2.25, backgroundColor: '#eeeeee' }}>
        {data.lable}
      </Box>
    )
  }
  //console.log('err ', data)
  return <></>
}

export default function CardWrapper ({ data }) {
  if(data==undefined) return <></>
  return <GetCard data={data} />
}
