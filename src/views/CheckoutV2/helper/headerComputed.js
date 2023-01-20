
export function headerItems() {
    const {apartments} = this

    const h = {
        pageInfo: {
            title: '',
            titleHighlight: ''
        },
        page: {
            type: 'string',
            path: this.$t('checkout_booking')
        },
        breadcrumbs: [
            {
                content: {
                    type: 'multi_language',
                    path: 'objects.title'
                },
                route: {
                    name: 'objects',
                    path: '/objects'
                }
            }
        ],
    }

    if (!apartments.length) {
        return h
    }

    const apmTitles = apartments.reduce((acc, apm, idx, arr) => {
        let str = apm.number
        if (arr.length - 1 !== idx) {
            str += ', '
        }
        return acc + str
    }, '')

    const {object} = apartments[0]

    if (object) {
        h.breadcrumbs.push({
            content: {
                type: 'string',
                path: object.name
            },
            route: {
                name: 'apartments',
                params: {
                    object: object.id
                }
            }
        })

        h.breadcrumbs.push({
            content: {
                type: 'string',
                path: this.$t('apartment') + ' ' + apmTitles
            },
            route: {
                name: 'apartment-view',
                params: {
                    object: object.id,
                    id: apartments[0].id
                }
            }
        })
    }

    if (this.isCreateMode) {
        h.pageInfo = {
            title: this.$t('apartment_make_contract'),
            titleHighlight: apmTitles
        }
    } else {
        h.pageInfo = {
            title: this.$t('edit_apartment'),
            titleHighlight: apmTitles
        }
    }


    return h
}