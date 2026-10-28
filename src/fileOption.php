<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of getProblem
 *
 * @author CyberWH
 */
class fileOption {
    private static function resolvePath($pathName) {
        $pathName = str_replace('\\', '/', trim((string)$pathName));
        if ($pathName === '') {
            return dirname(__DIR__) . '/resource/sgf';
        }

        if (preg_match('/^[A-Za-z]:\//', $pathName) === 1) {
            return $pathName;
        }

        if (strpos($pathName, '..') === 0 || strpos($pathName, './') === 0 || strpos($pathName, '/') === 0) {
            $pathName = ltrim($pathName, './');
        }

        return dirname(__DIR__) . '/' . $pathName;
    }

    private static function isUtf8($content) {
        if ($content === '') {
            return true;
        }

        return @preg_match('//u', $content) === 1;
    }

    private static function convertToUtf8($content, $encoding) {
        if ($encoding === 'UTF-8') {
            return $content;
        }

        $converted = @iconv($encoding, 'UTF-8//IGNORE', $content);
        if ($converted === false || !self::isUtf8($converted)) {
            return null;
        }

        return $converted;
    }

    private static function toUtf8($content) {
        if ($content === '') {
            return $content;
        }

        if (self::isUtf8($content)) {
            return $content;
        }

        $preferred = array('GB2312', 'GBK', 'GB18030', 'BIG5', 'Windows-1252', 'ASCII');
        if (preg_match('/CA\[([^\]]+)\]/i', $content, $matches) === 1) {
            $declared = trim($matches[1]);
            $declared = strtoupper($declared);
            if ($declared === 'GB2312' || $declared === 'GBK' || $declared === 'GB18030') {
                $preferred = array_merge(array($declared), $preferred);
            }
        }

        foreach ($preferred as $encoding) {
            $converted = self::convertToUtf8($content, $encoding);
            if ($converted !== null) {
                return $converted;
            }
        }

        return $content;
    }

    public static function readUtf8Text($pathName) {
        $resolvedPath = self::resolvePath($pathName);
        if (!file_exists($resolvedPath) || !is_file($resolvedPath)) {
            return '';
        }

        $content = file_get_contents($resolvedPath);
        if ($content === false) {
            return '';
        }

        return self::toUtf8($content);
    }

    public static function getFileList($pathName){
        $fileList = array();
        $resolvedPath = self::resolvePath($pathName);
        $dir = opendir($resolvedPath);

        if (!$dir) {
            if (!file_exists($resolvedPath) || !is_file($resolvedPath)) {
                return array(
                    'body' => array('fileList' => array()),
                    'status' => '0000'
                );
            }

            $handle = fopen($resolvedPath, "r");
            if ($handle === false) {
                return array(
                    'body' => array('fileList' => array()),
                    'status' => '0000'
                );
            }

            $fileContent = fread($handle, filesize($resolvedPath));
            fclose($handle);
            if (is_string($fileContent)) {
                $fileContent = iconv("GB2312", "UTF-8", $fileContent);
            }
            array_push($fileList, $fileContent);
        } else {
            while (($file = readdir($dir)) !== false) {
                if ($file === '.' || $file === '..') {
                    continue;
                }

                $fullPath = $resolvedPath . '/' . $file;
                $displayName = self::toUtf8($file);

                if (!is_dir($fullPath)) {
                    array_push($fileList, $displayName);
                } else {
                    array_push($fileList, $displayName);
                }
            }
            closedir($dir);
        }

        $response = array(
            'body' => array(
                'fileList' => $fileList
            ),
            'status' => '0000'
        );

        return $response;
    }
}
?>
