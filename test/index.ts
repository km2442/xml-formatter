import xmlFormat, {XMLFormatterOptions} from '../src/index';
import {assert} from 'chai';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

describe('XML formatter', function () {

    const assertFormat = function(src: string, formatterOptions?: XMLFormatterOptions) {
        glob.sync(src).forEach(file => {
            const outputFile = file.replace('-input', '-output');

            it('Assert: ' + path.basename(outputFile), function() {
                const fileContents = fs.readFileSync(file).toString('utf8');
                const formattedContents = xmlFormat(fileContents, formatterOptions);
                const formattedContents2 = xmlFormat(formattedContents, formatterOptions);
                let expectedContents = fs.readFileSync(outputFile).toString('utf8').trimEnd();
                const lineSeparator = formatterOptions?.lineSeparator || '\r\n';
                const relativeFilePath = path.relative(process.cwd(), file);

                expectedContents = expectedContents.replace(/\r/g, '').replace(/\n/g, lineSeparator);

                assert.equal(formattedContents, expectedContents, 'Formatted Content for ' + relativeFilePath);
                assert.equal(formattedContents2, expectedContents, 'Idempotence test for ' + relativeFilePath);
            });
        });
    }

    describe('should format XML with comments', function() {
        assertFormat('test/data1/xml*-input.xml');
    });

    describe('should format XML without comments', function() {
        assertFormat('test/data2/xml*-input.xml', {filter: (node) => node.type !== 'Comment'});
    });

    describe('should format XML without indenting text content when option is enabled:', function() {
        assertFormat('test/data3/xml*-input.xml', {collapseContent: true});
    });

    describe('should format XML with various node types', function() {
        assertFormat('test/data4/xml*-input.xml');
    });

    describe('should format XML with the custom line separator', function() {
        assertFormat('test/data5/xml*-input.xml', {lineSeparator: '\n'});
    });

    describe('should format XML that already contains line breaks', function() {
        assertFormat('test/data6/xml*-input.xml');
    });

    describe('should format XML adding a whitespace before self closing tag', function() {
        assertFormat('test/data7_white-space-on-closing-tag/xml*-input.xml', {whiteSpaceAtEndOfSelfclosingTag: true});
    });

    describe('should escape a double quote in an attribute value', function() {
        assertFormat('test/data8/xml*-input.xml');
    });

    describe('should format XML without indentation and line separation', function() {
        assertFormat('test/data9/xml*-input.xml', {indentation: '', lineSeparator: ''});
    });

});