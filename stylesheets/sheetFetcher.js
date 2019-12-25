function init() {
    Tabletop.init( { key: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ5LtUDxChRQV-1DFQyUxb4U74kJ0ZAANlexB9IW7sFnkKTzwS8Lq9P1A3Ryvma7Mfvi6zd9gf0Ioq/pubhtml?widget=true&amp;headers=false",
    callback: function(data, tabletop) {
        console.log(data)
    },
    simpleSheet: true } )
}
window.addEventListener('DOMContentLoaded', init)