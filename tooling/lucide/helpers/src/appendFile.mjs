/* eslint-disable import/prefer-default-export */
import fs from 'fs/promises'
import path from 'path'

/**
 * append content to a file
 *
 * @param {string} content
 * @param {string} fileName
 * @param {string} outputDirectory
 */
export const appendFile = (content, fileName, outputDirectory) => {
  if (!content.includes('.js') && content.length > 1) {
    console.log(content, content.length)
  }
  return fs.appendFile(path.join(outputDirectory, fileName), content, 'utf-8')
}
