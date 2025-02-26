/**
 * @package content
 */
import { shallowMount } from '@vue/test-utils';
import swCmsMissingElementModal from 'src/module/sw-cms/component/sw-cms-missing-element-modal';
import 'src/app/component/base/sw-modal';
import 'src/app/component/form/sw-checkbox-field';
import 'src/app/component/form/field-base/sw-base-field';
import 'src/app/component/form/field-base/sw-field-error';

Shopware.Component.register('sw-cms-missing-element-modal', swCmsMissingElementModal);

async function createWrapper() {
    return shallowMount(await Shopware.Component.build('sw-cms-missing-element-modal'), {
        propsData: {
            missingElements: [],
        },
        mocks: {
            $tc: (key, number, value) => {
                if (!value) {
                    return key;
                }
                return key + JSON.stringify(value);
            },
        },
        provide: {
            shortcutService: {
                startEventListener: () => {},
                stopEventListener: () => {},
            },
        },
        stubs: {
            'sw-modal': await Shopware.Component.build('sw-modal'),
            'sw-button': true,
            'sw-icon': true,
            'sw-checkbox-field': await Shopware.Component.build('sw-checkbox-field'),
            'sw-base-field': await Shopware.Component.build('sw-base-field'),
            'sw-field-error': await Shopware.Component.build('sw-field-error'),
        },
    });
}

describe('module/sw-cms/component/sw-cms-missing-element-modal', () => {
    it('should emit an event when clicking on cancel button', async () => {
        const wrapper = await createWrapper();

        wrapper.find('.sw-cms-missing-element-modal__button-cancel').vm.$emit('click');

        const pageChangeEvents = wrapper.emitted('modal-close');

        expect(pageChangeEvents).toHaveLength(1);
    });

    it('should emit an event when clicking on save button', async () => {
        const wrapper = await createWrapper();

        wrapper.find('.sw-cms-missing-element-modal__button-save').vm.$emit('click');

        const pageChangeEvents = wrapper.emitted('modal-save');

        expect(pageChangeEvents).toHaveLength(1);
    });

    it('should emit an event when check on dont remind checkbox', async () => {
        const wrapper = await createWrapper();

        await wrapper.find('.sw-cms-missing-element-modal__dont-remind').find('input').trigger('change');

        const pageChangeEvents = wrapper.emitted()['modal-dont-remind-change'];

        expect(pageChangeEvents).toHaveLength(1);
    });

    it('should expose no missing element', async () => {
        const wrapper = await createWrapper();

        const title = await wrapper.find('.sw-cms-missing-element-modal__title');

        expect(title.text()).toBe(
            'sw-cms.components.cmsMissingElementModal.title{"element":""}',
        );
    });

    it('should expose one missing element', async () => {
        const wrapper = await createWrapper();

        await wrapper.setProps({
            missingElements: ['buyBox'],
        });

        const title = await wrapper.find('.sw-cms-missing-element-modal__title');

        expect(title.text()).toBe(
            'sw-cms.components.cmsMissingElementModal.title{"element":"sw-cms.elements.buyBox.label"}',
        );
    });

    it('should expose two missing elements', async () => {
        const wrapper = await createWrapper();

        await wrapper.setProps({
            missingElements: ['buyBox', 'productDescriptionReviews'],
        });

        const title = await wrapper.find('.sw-cms-missing-element-modal__title');

        expect(title.text()).toBe(
            // eslint-disable-next-line max-len
            'sw-cms.components.cmsMissingElementModal.title{"element":"sw-cms.elements.buyBox.label, sw-cms.elements.productDescriptionReviews.label"}',
        );
    });

    it('should expose three missing elements', async () => {
        const wrapper = await createWrapper();

        await wrapper.setProps({
            missingElements: ['buyBox', 'productDescriptionReviews', 'crossSelling'],
        });

        const title = wrapper.find('.sw-cms-missing-element-modal__title');

        expect(title.text()).toBe(
            // eslint-disable-next-line max-len
            'sw-cms.components.cmsMissingElementModal.title{"element":"sw-cms.elements.buyBox.label, sw-cms.elements.productDescriptionReviews.label, sw-cms.elements.crossSelling.label"}',
        );
    });
});
