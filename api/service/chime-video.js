'use strict'

const AWS = require('aws-sdk')

let chime = new AWS.Chime({
  endpoint: process.env.CHIME_ENDPOINT || 'https://service.chime.aws.amazon.com',
  accessKeyId: process.env.CHIME_ACCESS_KEY,
  secretAccessKey: process.env.CHIME_KEY_SECRET,
  region: 'us-east-1',
  apiVersion: '2018-05-01'
})

class Singleton {
  /**
   * Creates an AWS Chime instance
   *
   *
   */
  constructor () {
    if (!Singleton.instance) {
      if (!chime) {
        chime = new AWS.Chime({
          endpoint: process.env.CHIME_ENDPOINT || 'https://service.chime.aws.amazon.com',
          accessKeyId: process.env.CHIME_ACCESS_KEY,
          secretAccessKey: process.env.CHIME_KEY_SECRET,
          region: 'us-east-1',
          apiVersion: '2018-05-01'
        })
      }
      this.chime = chime
      Singleton.instance = this
    }
    return Singleton.instance
  }

  /**
   * Create a Chime Meeting
   * @param {string} identifier identifier
   * @param {string} externalMeetingId name
   * @param {string} meetingRegion region
   */
  async createMeeting (identifier, externalMeetingId, meetingRegion = process.env.CHIME_AWS_REGION) {
    return chime.createMeeting({
      ClientRequestToken: identifier,
      MediaRegion: meetingRegion,
      ExternalMeetingId: externalMeetingId
    }).promise()
  }

  /**
   * Add attendees to an existing meeting
   * @param {string} meetingId meeting identifier
   * @param {object[]} attendees list of attendees
   */
  async addAttendeesToMeeting (meetingId, attendees = []) {
    return chime.batchCreateAttendee({
      Attendees: attendees,
      MeetingId: meetingId
    }).promise()
  }

  /**
   * Delete a Chime Meeting
   * @param {string} meetingId meeting identifier
   */
  async deleteMeeting (meetingId) {
    return chime.deleteMeeting({
      MeetingId: meetingId
    }).promise()
  }

  /**
   * Get a meeting information
   * @param {string} meetingId meeting identifier
   */
  async getMeeting (meetingId) {
    return chime.getMeeting({
      MeetingId: meetingId
    }).promise()
  }

  /**
   * Get list of meeting attendees
   * @param {string} meetingId meeting identifer
   * @param {number} maxResults max results
   */
  async getAttendeeList (meetingId, maxResults = 4) {
    return chime.listAttendees({
      MeetingId: meetingId,
      MaxResults: maxResults
    }).promise()
  }

  /**
   * remove an attendee from a meeting
   * @param {string} meetingId meeting identifier
   * @param {string} attendeeId attendee identifier
   */
  async deleteAttendee (meetingId, attendeeId) {
    return chime.deleteAttendee({
      MeetingId: meetingId,
      AttendeeId: attendeeId
    })
  }
}
const instance = new Singleton()

module.exports = instance
