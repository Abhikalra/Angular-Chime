'use strict'

const router = require('express').Router()

const ChimeVideoController = require('../controller/chimeVideo')

/**
 * Logs the error
 * @param {[type]} err - The error to be logged.
 * @param {string} message error message to log
 * @param {Function} next - The next callback from express to continue the routing.
 */
const log = (err, message, next) => {
  console.log(message)
  console.error(err)
  return next(err)
}

/**
 * @api {post} /video-call Create a new Chime Meeting
 * @apiName CreateMeeting
 * @apiGroup VideoCallService
 * @apiDescription Create a new Chime Meeting
 *
 *
 * @apiParam (body) {object}  options      Additional options
 * @apiParam (body) {string}  options.externalMeetingName    Custom meeting name
 * @apiParam (body) {object[]}  attendees      Meeting attendees
 * @apiParam (body) {string}  attendees.name      Name
 * @apiSuccess {object}       Meeting       meeting information object
 *
 **/
router.post('/', async (req, res, next) => {
  try {
    const options = req.body.options
    const attendees = req.body.attendees
    const meeting = await ChimeVideoController.createMeeting(attendees, options)
    res.json({ meeting })
  } catch (err) {
    log(err, 'route : /video-call, METHOD: POST', next)
  }
})

/**
 * @api {delete} /video-call/:meetingId Delete a Chime Meeting
 * @apiName DeleteMeeting
 * @apiGroup VideoCallService
 * @apiDescription Delete a Chime Meeting
 *
 * @apiParam (url) {string}  meetingId      MeetingId
 * */
router.delete('/:meetingId', async (req, res, next) => {
  try {
    await ChimeVideoController.deleteMeeting(req.params.meetingId)
    res.json({ status: 'ok', meetingId: req.params.meetingId })
  } catch (err) {
    log(err, `route : /video-call, METHOD: DELETE, MeetingId: ${req.params.meetingId}`, next)
  }
})

/**
 * @api {get} /video-call/:meetingId Get a Chime Meeting information
 * @apiName getMeeting
 * @apiGroup VideoCallService
 * @apiDescription Get a Chime Meeting information
 *
 * @apiParam (url) {string}  meetingId      MeetingId
 * @apiSuccess {object}       Meeting       meeting information object
 * */
router.get('/:meetingId', async (req, res, next) => {
  try {
    const meeting = await ChimeVideoController.getMeeting(req.params.meetingId)
    res.json({ meeting })
  } catch (err) {
    log(err, `route : /video-call, METHOD: GET, MeetingId: ${req.params.meetingId}`, next)
  }
})

/**
 * @api {post} /video-call/:meetingId/add-attendees Add Attendee to an existing meeting
 * @apiName AddAttendeeToMeeting
 * @apiGroup VideoCallService
 * @apiDescription Add Attendee to an existing meeting
 *
 * @apiParam (url) {string}  meetingId      MeetingId
 * @apiParam (body) {object[]}  attendees      Meeting attendees
 * @apiParam (body) {string}  attendees.name      Name
 * @apiSuccess {object}       Meeting       attendee information so returned
 * */
router.post('/:meetingId/add-attendees', async (req, res, next) => {
  try {
    const attendees = req.body.attendees
    const meeting = await ChimeVideoController.addAttendees(req.params.meetingId, attendees)
    res.json({ meeting })
  } catch (err) {
    log(err, `route : /video-call/:meetingId/add-attendees, METHOD: POST, MeetingId: ${req.params.meetingId}`, next)
  }
})

/**
 * @api {delete} /video-call/:meetingId/get-attendees Get attendees in a meeting
 * @apiName GetAttendeeInMeeting
 * @apiGroup VideoCallService
 * @apiDescription Get attendees in a meeting
 *
 * @apiParam (url) {string}  meetingId      MeetingId
 * @apiSuccess {object[]}       attendees       attendee information so returned
 * */
router.get('/:meetingId/get-attendees', async (req, res, next) => {
  try {
    const attendees = await ChimeVideoController.getAttendees(req.params.meetingId)
    res.json(attendees)
  } catch (err) {
    log(err, `route : /video-call/:meetingId/get-attendees, METHOD: GET, MeetingId: ${req.params.meetingId}`, next)
  }
})

module.exports = router
