import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"

describe("IdeaSubmissionForm component", () => {
  let wrapper

  const onSubmitIdeaStub = () => {}
  const onToggleActionItemStub = () => {}
  const fakeEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined,
  }

  describe("on submit", () => {
    it("invokes the function passed as the onIdeaSubmission prop", () => {
      const onSubmitIdeaSpy = sinon.spy(() => {})
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaSpy} onToggleActionItem={onToggleActionItemStub}/>)

      wrapper.simulate("submit", fakeEvent)

      expect(onSubmitIdeaSpy.called).to.equal(true)
    })
  })

  describe("when a category is selected", () => {
    it("shifts focus to the idea input", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub}/>)

      const ideaInput = wrapper.find("input[name='idea']")
      const categorySelect = wrapper.find("select")

      expect(document.activeElement).to.equal(ideaInput.node)
      document.activeElement.blur()
      expect(document.activeElement).not.to.equal(wrapper.find("input[name='idea']").node)

      categorySelect.simulate("change")
      expect(document.activeElement).to.equal(ideaInput.node)
    })
  })

  describe("at the outset the form submit is disabled", () => {
    it("is enabled once there is an idea of 3 characters or longer", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub}/>)
      const submitButton = wrapper.find("button[type='submit']")
      const ideaInput = wrapper.find("input[name='idea']")

      expect(submitButton.prop("disabled")).to.equal(true)
      ideaInput.simulate("change", { target: { value: "farts" } })
      expect(submitButton.prop("disabled")).to.equal(false)
    })
  })

  describe("action items toggle", () => {
    it("is false on render", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub} />)
      const actionItemsToggle = wrapper.find("input[type='checkbox']")

      expect(actionItemsToggle.getNode().checked).to.equal(false)
    })

    it("invokes the method passed as onToggleActionItem on change", () => {
      const onToggleActionItemSpy = sinon.spy()

      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemSpy} />)

      const actionItemsToggle = wrapper.find("input[type='checkbox']")
      actionItemsToggle.simulate("change")
      expect(onToggleActionItemSpy.called).to.equal(true)
    })
  })

  describe(".componentWillReceiveProps", () => {
    describe("when the `category` state attribute is stubbed with nonsense", () => {
      beforeEach(() => {
        wrapper = mount(
          <IdeaSubmissionForm
            onIdeaSubmission={onSubmitIdeaStub}
            onToggleActionItem={onToggleActionItemStub}
          />
        )

        wrapper.setState({ category: "stub" })
      })

      describe("passing the `showActionItem` prop as true", () => {
        it("changes the state `category` to 'action-item'", () => {
          wrapper.setProps({ showActionItem: true })
          expect(wrapper.state("category")).to.equal("action-item")
        })
      })

      describe("passing the `showActionItem` prop as false", () => {
        it("changes the state `category` to 'happy'", () => {
          wrapper.setProps({ showActionItem: false })
          expect(wrapper.state("category")).to.equal("happy")
        })
      })
    })
  })

  describe("the showActionItem prop", () => {
    it("when true results in the category list only rendering an 'action-item' option", () => {
      wrapper = mount(
        <IdeaSubmissionForm
          onIdeaSubmission={onSubmitIdeaStub}
          onToggleActionItem={onToggleActionItemStub}
          showActionItem={true}
        />
      )

      const categorySelect = wrapper.find('select')
      expect(
        categorySelect.contains(<option value="action-item">action-item</option>)
      ).to.equal(true)
    })

    it("when false results in the category list rendering options for the basic retro categories", () => {
      wrapper = mount(
        <IdeaSubmissionForm
          onIdeaSubmission={onSubmitIdeaStub}
          onToggleActionItem={onToggleActionItemStub}
          showActionItem={false}
        />
      )

      const categorySelect = wrapper.find('select')

      const presumedMatches = [
        <option key="happy" value="happy">happy</option>,
        <option key="sad" value="sad">sad</option>,
        <option key="confused" value="confused">confused</option>,
      ]

      expect(
        categorySelect.contains(presumedMatches)
      ).to.equal(true)


      expect(
        categorySelect.contains(<option value="action-item">action-item</option>)
      ).to.equal(false)
    })
  })
})
