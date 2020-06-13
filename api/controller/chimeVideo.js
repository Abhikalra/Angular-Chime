'use strict'
const ChimeVideo = require('../service/chime-video')
const uuid = require('uuid/v4')

const websiteUrl = process.env.FRONTEND_URL + 'video-call/'

/**
 * Creates an external meeting name
 */
const getMeetingExternalTitle = () => {
  return `chime-meeting:${uuid().substring(0, 8)}`
}

module.exports = {
  /**
   * Create a Chime meeting instance
   * @param {object[]} attendees list of attendees
   * @param {object} options options
   */
  async createMeeting (attendees = [], options = {}) {
    if (attendees.length > 4) {
      const err = new Error('Cannot add any further attendees to meeting.')
      err.statusCode = 404
      err.status = 404
      throw err
    }
    const meetingAttendees = attendees.map(attendee => {
      const obj = {
        ExternalUserId: `${attendee.name}`
      }
      attendee.ExternalUserId = obj.ExternalUserId
      return obj
    })
    const externalIdentifier = options.externalMeetingName || getMeetingExternalTitle()
    const meeting = (await ChimeVideo.createMeeting(uuid(), externalIdentifier)).Meeting
    if (meeting) {
      const attendees = (await ChimeVideo.addAttendeesToMeeting(meeting.MeetingId, meetingAttendees)).Attendees
      attendees ? meeting.attendees = attendees : meeting.attendees = []
    }
    const meetingInformation = {
      meetingTitle: meeting.ExternalMeetingId,
      meetingId: meeting.MeetingId,
      attendeeLinks: []
    }
    meetingInformation.attendeeLinks = meeting.attendees.map(attendee => {
      const userInfo = attendees.find(user => user.ExternalUserId === attendee.ExternalUserId)
      const joiningLink = `${websiteUrl}${meeting.MeetingId}&AttendeeId=${attendee.AttendeeId}&JoinToken=${attendee.JoinToken}&ExternalUserId=${attendee.ExternalUserId}`
      return { ...userInfo, joiningLink }
    })
    return meetingInformation
  },

  /**
   * delete a chime meeting
   * @param {string} meetingId meeting identifier
   */
  async deleteMeeting (meetingId) {
    const result = await ChimeVideo.deleteMeeting(meetingId)
    if (result) return true
  },

  /**
   * Get Chime meeting information
   * @param {string} meetingId meeting identifier
   */
  async getMeeting (meetingId) {
    const result = (await ChimeVideo.getMeeting(meetingId)).Meeting
    return result
  },

  /**
   * Add attendees to a Chime meeting
   * @param {string} meetingId meeting identifier
   * @param {object[]} attendees attendee list
   */
  async addAttendees (meetingId, attendees = []) {
    const existingAttendees = (await this.getAttendees(meetingId)).attendees
    if (existingAttendees.length === 4) {
      const err = new Error('Cannot add any further attendees to meeting.')
      err.statusCode = 404
      err.status = 404
      throw err
    }
    if (existingAttendees.length + attendees.length > 4) {
      const err = new Error('Cannot add more than four attendees to meeting.')
      err.statusCode = 404
      err.status = 404
      throw err
    }
    const meetingAttendees = attendees.map(attendee => {
      const obj = {
        ExternalUserId: `${attendee.name}`
      }
      attendee.ExternalUserId = obj.ExternalUserId
      return obj
    })
    const result = await (await ChimeVideo.addAttendeesToMeeting(meetingId, meetingAttendees)).Attendees
    result.map(attendee => {
      attendee.joiningLink = `${websiteUrl}${meetingId}&AttendeeId=${attendee.AttendeeId}&JoinToken=${attendee.JoinToken}&ExternalUserId=${attendee.ExternalUserId}`
    })
    return result
  },

  /**
   * Get list of attendees in a Chime Meeting
   * @param {string} meetingId meeting identifier
   */
  async getAttendees (meetingId) {
    const result = (await ChimeVideo.getAttendeeList(meetingId)).Attendees
    return {
      meetingId: meetingId,
      attendees: result
    }
  }
}
