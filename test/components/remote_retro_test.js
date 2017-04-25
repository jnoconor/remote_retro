import React from "react"
import { shallow } from "enzyme"
import RemoteRetro from "../../web/static/js/components/remote_retro"

describe("<RemoteRetro>", () => {
  const mockRetroChannel = {
    on: () => (mockRetroChannel),
    join: () => (mockRetroChannel),
    receive: () => (mockRetroChannel),
  }
  context("when the current user is a facilitator", () => {
    const presences = {
      userToken: {
        user: { is_facilitator: true },
      },
    }

    it("renders a room with isFacilitiator true", () => {
      const wrapper = shallow(
        <RemoteRetro userToken="userToken" retroChannel={mockRetroChannel} />)

      wrapper.setState({ presences })

      const room = wrapper.find("Room")

      expect(room.prop("isFacilitator")).to.equal(true)
    })
  })

  context("when the current user is not a facilitator", () => {
    const presences = {
      userToken: {
        user: {},
      },
    }

    it("renders a room with isFacilitiator false", () => {
      const wrapper = shallow(
        <RemoteRetro userToken="userToken" retroChannel={mockRetroChannel} />)

      wrapper.setState({ presences })

      const room = wrapper.find("Room")

      expect(room.prop("isFacilitator")).to.equal(false)
    })
  })
})
