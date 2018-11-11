function is(got, exp, desc) {
  if ( !desc ) { desc = '' }

  if ( got === exp ) {
    Logger.log(' [OK] ' + desc)
  }
  else {
    Logger.log(' [NG] ' + desc)
    Logger.log('     got: ' + got)
    Logger.log('     exp: ' + exp)
  }
}



